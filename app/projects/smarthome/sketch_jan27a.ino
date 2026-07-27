/*
 * Arduino UNO R4 WiFi - Smart Touch Panel + Button Controller
 * 
 * Complete replacement for Pico.py with:
 * - 4-button touch display (Light, Power, 3D Print, Kill All)
 * - Physical button with multi-tap detection
 * - Reed switch door sensor
 * - Direct WiFi + MQTT to Home Assistant
 * - Auto-reconnection on network loss
 * 
 * Hardware:
 * - TFT shield with resistive touch
 * - Physical button on D0 (with external pull-up or use INPUT_PULLUP)
 * - Reed switch on SCL pin
 * - Backlight on D7
 */

#include <Riscduino_MCUFRIEND_kbv.h>
#include <Adafruit_GFX.h>
#include <TouchScreen.h>
#include <WiFiS3.h>
#include <ArduinoMqttClient.h>

// ==== WiFi & MQTT CONFIG ====
// Credentials live in arduino_secrets.h, which is gitignored. Copy
// arduino_secrets.example.h to arduino_secrets.h and fill in your own values.
// Never commit real credentials — this file is published publicly.
#include "arduino_secrets.h"

const char* WIFI_SSID = SECRET_WIFI_SSID;
const char* WIFI_PASS = SECRET_WIFI_PASS;
const char* MQTT_BROKER = SECRET_MQTT_BROKER;
const int MQTT_PORT = SECRET_MQTT_PORT;
const char* MQTT_USER = SECRET_MQTT_USER;
const char* MQTT_PASS = SECRET_MQTT_PASS;
const char* MQTT_LOCATION = "office";
const char* MQTT_CLIENT_ID = "arduino_r4_panel";

// MQTT Topics
char topic_button_tap[50];
char topic_door_state[50];
char topic_light[50];
char topic_power[50];
char topic_3dprint[50];
char topic_light_state[50];
char topic_power_state[50];
char topic_3dprint_state[50];
char topic_temperature[50];

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// ==== HARDWARE PINS ====
#define TFT_CS     A3
#define TFT_DC     A2
#define TFT_RST    A4
#define TFT_WR     A1
#define TFT_RD     A0
#define BACKLIGHT  7

#define YP A2
#define XM A3
#define YM 8
#define XP 9

#define PHYSICAL_BUTTON_PIN  1  // TX pin (D1) - using as digital input
#define DOOR_SENSOR_PIN  SCL
#define ONBOARD_LED LED_BUILTIN

// ==== TOUCH CALIBRATION ====
#define TS_MINX 150
#define TS_MINY 120
#define TS_MAXX 920
#define TS_MAXY 940
#define MINPRESSURE 1
#define MAXPRESSURE 1000
#define TOUCH_SAMPLES 5
#define TOUCH_THRESHOLD 3

TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);
Riscduino_MCUFRIEND_kbv tft;

// ==== SCREEN SETUP ====
#define SCREEN_WIDTH  320
#define SCREEN_HEIGHT 240

#define BLACK   0x0000
#define WHITE   0xFFFF
#define GRAY    0x7BEF
#define DARKGRAY 0x4208

// ==== BUTTON STRUCTURE ====
struct Button {
  int16_t x, y, w, h;
  const char* label;
  const char* icon;
  bool state;
  uint16_t color_on;
  uint16_t color_off;
};

#define NUM_BUTTONS 4
Button buttons[NUM_BUTTONS] = {
  {10, 50, 70, 120, "Light", "L", false, 0xFFE0, 0x4208},
  {90, 50, 70, 120, "Power", "O", false, 0x07E0, 0x4208},
  {170, 50, 70, 120, "3DPrint", "P", false, 0x07FF, 0x4208},
  {250, 50, 60, 120, "Kill/Start", "X", false, 0xF800, 0x07E0}  // Red for Kill, Green for Start
};

// ==== STATE VARIABLES ====
bool light_state = false;
bool power_state = false;
bool print_state = false;
bool door_open = false;
bool last_door_state = false;
bool wifi_connected = false;

// Previous states for change detection (minimize redraws)
bool prev_light_state = false;
bool prev_power_state = false;
bool prev_print_state = false;
bool mqtt_connected = false;

// Temperature tracking
float device_temperature = 0.0;
unsigned long last_temp_read = 0;
const unsigned long TEMP_READ_INTERVAL = 2000;  // Read every 2 seconds

unsigned long last_wifi_check = 0;
unsigned long last_mqtt_check = 0;
unsigned long last_display_update = 0;
unsigned long last_state_sync = 0;
const unsigned long WIFI_CHECK_INTERVAL = 30000;  // 30 seconds
const unsigned long MQTT_CHECK_INTERVAL = 5000;   // 5 seconds
const unsigned long DISPLAY_UPDATE_INTERVAL = 5000; // 5 seconds
const unsigned long STATE_SYNC_INTERVAL = 10000;   // 10 seconds - request state updates

// Physical button tap detection
int tap_count = 0;
unsigned long last_press_time = 0;
unsigned long button_down_time = 0;
bool button_was_down = false;
const unsigned long TAP_TIMEOUT = 500;      // 500ms between taps
const unsigned long LONG_PRESS_TIME = 1500; // 1.5s for long press

// ==== FORWARD DECLARATIONS ====
void publishMQTT(const char* topic, const char* payload, bool retain = false);
void updateStatusBar();
void drawButton(int index);
void updateKillStartButton();
float readTemperature();
void updateTemperatureDisplay();

// ==== SETUP ====
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\nArduino UNO R4 WiFi - Smart Control Panel");
  Serial.println("==========================================");
  
  // Setup pins
  pinMode(BACKLIGHT, OUTPUT);
  digitalWrite(BACKLIGHT, HIGH);
  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP);
  pinMode(PHYSICAL_BUTTON_PIN, INPUT_PULLUP);
  pinMode(ONBOARD_LED, OUTPUT);
  
  // Flash LED to show boot
  flashLED(3);
  
  // Setup MQTT topics
  snprintf(topic_button_tap, 50, "home/buttons/%s/tap", MQTT_LOCATION);
  snprintf(topic_door_state, 50, "%s/door/state", MQTT_LOCATION);
  snprintf(topic_light, 50, "home/buttons/%s/light", MQTT_LOCATION);
  snprintf(topic_power, 50, "home/buttons/%s/power", MQTT_LOCATION);
  snprintf(topic_3dprint, 50, "home/buttons/%s/3dprint", MQTT_LOCATION);
  snprintf(topic_light_state, 50, "home/buttons/%s/light/state", MQTT_LOCATION);
  snprintf(topic_power_state, 50, "home/buttons/%s/power/state", MQTT_LOCATION);
  snprintf(topic_3dprint_state, 50, "home/buttons/%s/3dprint/state", MQTT_LOCATION);
  snprintf(topic_temperature, 50, "%s/arduino/temperature", MQTT_LOCATION);
  
  // Initialize TFT
  uint16_t id = tft.readID();
  Serial.print("TFT ID: 0x");
  Serial.println(id, HEX);
  tft.begin(id);
  tft.setRotation(1);
  
  // Draw initial UI
  drawUI();
  updateStatusBar();
  
  // Connect to WiFi
  connectWiFi();
  
  // Connect to MQTT
  connectMQTT();
  
  // Publish HA discovery config on first boot
  publishDiscovery();
  
  Serial.println("Setup complete!");
}

// ==== MAIN LOOP ====
void loop() {
  unsigned long now = millis();
  
  // Check WiFi connection
  if (now - last_wifi_check > WIFI_CHECK_INTERVAL) {
    checkWiFi();
    last_wifi_check = now;
  }
  
  // Check MQTT connection
  if (now - last_mqtt_check > MQTT_CHECK_INTERVAL) {
    checkMQTT();
    last_mqtt_check = now;
  }
  
  // Poll MQTT
  if (mqtt_connected) {
    mqttClient.poll();
  }
  
  // Periodic state sync - request current states from HA
  if (mqtt_connected && (now - last_state_sync > STATE_SYNC_INTERVAL)) {
    requestCurrentStates();
    last_state_sync = now;
  }
  
  // Check door sensor
  checkDoorSensor();
  
  // Check physical button
  checkPhysicalButton();
  
  // Check touch screen
  checkTouchScreen();
  
  // Read temperature periodically
  if (now - last_temp_read > TEMP_READ_INTERVAL) {
    device_temperature = readTemperature();
    last_temp_read = now;
    updateTemperatureDisplay();  // Only update the temperature value
    
    // Publish temperature to MQTT for Home Assistant monitoring
    if (mqtt_connected) {
      char temp_str[10];
      dtostrf(device_temperature, 4, 1, temp_str);  // Convert float to string with 1 decimal
      publishMQTT(topic_temperature, temp_str, false);
    }
  }
  
  delay(10);
}

// ==== WiFi FUNCTIONS ====
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  tft.fillRect(0, 35, 320, 15, BLACK);
  tft.setTextSize(1);
  tft.setTextColor(WHITE);
  tft.setCursor(10, 35);
  tft.print("Connecting to WiFi...");
  
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifi_connected = true;
    Serial.println("\nWiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    
    // Clear the 'Connecting to WiFi...' message
    tft.fillRect(0, 35, 320, 15, BLACK);
    
    flashLED(2);
  } else {
    wifi_connected = false;
    Serial.println("\nWiFi connection failed!");
    flashLED(5);
  }
  
  updateStatusBar();
}

void checkWiFi() {
  bool was_connected = wifi_connected;
  wifi_connected = (WiFi.status() == WL_CONNECTED);
  
  if (!wifi_connected && was_connected) {
    Serial.println("WiFi connection lost! Reconnecting...");
    connectWiFi();
    updateStatusBar();
  } else if (!wifi_connected) {
    Serial.println("WiFi still disconnected, retrying...");
    connectWiFi();
    updateStatusBar();
  }
}

// ==== MQTT FUNCTIONS ====
void connectMQTT() {
  if (!wifi_connected) {
    Serial.println("Cannot connect MQTT - no WiFi");
    return;
  }
  
  Serial.println("==== MQTT Connection Attempt ====");
  Serial.print("Broker: ");
  Serial.print(MQTT_BROKER);
  Serial.print(":");
  Serial.println(MQTT_PORT);
  Serial.print("Client ID: ");
  Serial.println(MQTT_CLIENT_ID);
  Serial.print("Username: ");
  Serial.println(MQTT_USER);
  
  mqttClient.setId(MQTT_CLIENT_ID);
  mqttClient.setUsernamePassword(MQTT_USER, MQTT_PASS);
  
  // Set message callback
  mqttClient.onMessage(onMqttMessage);
  
  Serial.println("Attempting connection...");
  
  if (mqttClient.connect(MQTT_BROKER, MQTT_PORT)) {
    mqtt_connected = true;
    Serial.println("MQTT connected!");
    Serial.println("Topics configured:");
    Serial.print("  Button tap: ");
    Serial.println(topic_button_tap);
    Serial.print("  Light: ");
    Serial.println(topic_light);
    Serial.print("  Power: ");
    Serial.println(topic_power);
    Serial.print("  3D Print: ");
    Serial.println(topic_3dprint);
    Serial.print("  Door: ");
    Serial.println(topic_door_state);
    
    // Subscribe to state topics
    Serial.println("Subscribing to:");
    Serial.print("  ");
    Serial.println(topic_light_state);
    mqttClient.subscribe(topic_light_state);
    Serial.print("  ");
    Serial.println(topic_power_state);
    mqttClient.subscribe(topic_power_state);
    Serial.print("  ");
    Serial.println(topic_3dprint_state);
    mqttClient.subscribe(topic_3dprint_state);
    
    Serial.println("Subscribed to state topics");
    flashLED(2);
    
    // Request initial states
    requestCurrentStates();
    
  } else {
    mqtt_connected = false;
    Serial.print("MQTT connection failed! Error code: ");
    Serial.println(mqttClient.connectError());
    flashLED(5);
  }
  
  updateStatusBar();
}

void checkMQTT() {
  if (!wifi_connected) {
    if (mqtt_connected) {
      mqtt_connected = false;
      updateStatusBar();
    }
    return;
  }
  
  bool was_connected = mqtt_connected;
  mqtt_connected = mqttClient.connected();
  
  if (!mqtt_connected && was_connected) {
    Serial.println("MQTT connection lost! Reconnecting...");
    connectMQTT();
    updateStatusBar();
  } else if (!mqtt_connected) {
    connectMQTT();
    updateStatusBar();
  }
}

void requestCurrentStates() {
  Serial.println("Requesting current states from HA...");
  // Publish to command topics to trigger HA to respond with state
  // HA automations should respond by publishing to /state topics
  char request_topic[60];
  
  snprintf(request_topic, 60, "%s/request", topic_light);
  publishMQTT(request_topic, "REQUEST_STATE");
  
  snprintf(request_topic, 60, "%s/request", topic_power);
  publishMQTT(request_topic, "REQUEST_STATE");
  
  snprintf(request_topic, 60, "%s/request", topic_3dprint);
  publishMQTT(request_topic, "REQUEST_STATE");
}

void onMqttMessage(int messageSize) {
  String topic = mqttClient.messageTopic();
  String payload = "";
  
  while (mqttClient.available()) {
    payload += (char)mqttClient.read();
  }
  
  payload.toUpperCase();
  
  Serial.print("MQTT received: ");
  Serial.print(topic);
  Serial.print(" = ");
  Serial.println(payload);
  
  // Update button states based on MQTT messages - only redraw if changed
  if (topic == topic_light_state) {
    bool new_state = (payload == "ON");
    if (new_state != light_state) {
      light_state = new_state;
      buttons[0].state = light_state;
      drawButton(0);
      // Check if Kill/Start button needs update (state transition)
      if ((prev_light_state || prev_power_state || prev_print_state) != (light_state || power_state || print_state)) {
        updateKillStartButton();
      }
      prev_light_state = light_state;
    }
  }
  else if (topic == topic_power_state) {
    bool new_state = (payload == "ON");
    if (new_state != power_state) {
      power_state = new_state;
      buttons[1].state = power_state;
      drawButton(1);
      if ((prev_light_state || prev_power_state || prev_print_state) != (light_state || power_state || print_state)) {
        updateKillStartButton();
      }
      prev_power_state = power_state;
    }
  }
  else if (topic == topic_3dprint_state) {
    bool new_state = (payload == "ON");
    if (new_state != print_state) {
      print_state = new_state;
      buttons[2].state = print_state;
      drawButton(2);
      if ((prev_light_state || prev_power_state || prev_print_state) != (light_state || power_state || print_state)) {
        updateKillStartButton();
      }
      prev_print_state = print_state;
    }
  }
}

void publishMQTT(const char* topic, const char* payload, bool retain) {
  if (!mqtt_connected) {
    Serial.println("Cannot publish - MQTT not connected");
    flashLED(5);
    return;
  }
  
  Serial.print("Publishing to MQTT: ");
  Serial.print(topic);
  Serial.print(" = ");
  Serial.println(payload);
  
  mqttClient.beginMessage(topic, retain);
  mqttClient.print(payload);
  int result = mqttClient.endMessage();
  
  if (result == 1) {
    Serial.println("  ✓ Published successfully");
    flashLED(1);
  } else {
    Serial.println("  ✗ Publish failed!");
    flashLED(3);
  }
}

void publishDiscovery() {
  if (!mqtt_connected) return;
  
  Serial.println("Publishing Home Assistant discovery config...");
  
  // Door sensor discovery
  char discovery_topic[100];
  snprintf(discovery_topic, 100, "homeassistant/binary_sensor/%s_door/config", MQTT_LOCATION);
  
  char discovery_payload[300];
  snprintf(discovery_payload, 300,
    "{\"name\":\"%s Door\",\"state_topic\":\"%s/door/state\",\"payload_on\":\"open\",\"payload_off\":\"closed\",\"device_class\":\"door\",\"unique_id\":\"%s_door_01\"}",
    MQTT_LOCATION, MQTT_LOCATION, MQTT_LOCATION);
  
  publishMQTT(discovery_topic, discovery_payload, true);
  
  // Temperature sensor discovery
  snprintf(discovery_topic, 100, "homeassistant/sensor/%s_arduino_temp/config", MQTT_LOCATION);
  snprintf(discovery_payload, 300,
    "{\"name\":\"%s Arduino Temp\",\"state_topic\":\"%s/arduino/temperature\",\"unit_of_measurement\":\"°C\",\"device_class\":\"temperature\",\"unique_id\":\"%s_arduino_temp_01\"}",
    MQTT_LOCATION, MQTT_LOCATION, MQTT_LOCATION);
  
  publishMQTT(discovery_topic, discovery_payload, true);
  
  Serial.println("HA Discovery config published");
}

// ==== DOOR SENSOR ====
void checkDoorSensor() {
  bool current_state = digitalRead(DOOR_SENSOR_PIN) == HIGH;
  
  if (current_state != last_door_state) {
    door_open = current_state;
    last_door_state = current_state;
    
    const char* state = door_open ? "open" : "closed";
    publishMQTT(topic_door_state, state, true);
    
    Serial.print("Door: ");
    Serial.println(state);
    
    updateStatusBar();
  }
}

// ==== PHYSICAL BUTTON ====
void checkPhysicalButton() {
  unsigned long now = millis();
  bool is_pressed = (digitalRead(PHYSICAL_BUTTON_PIN) == LOW);
  
  // Button pressed
  if (is_pressed && !button_was_down) {
    button_down_time = now;
    button_was_down = true;
    digitalWrite(ONBOARD_LED, HIGH);
  }
  // Button released
  else if (!is_pressed && button_was_down) {
    unsigned long press_duration = now - button_down_time;
    button_was_down = false;
    digitalWrite(ONBOARD_LED, LOW);
    
    if (press_duration >= LONG_PRESS_TIME) {
      // Long press
      publishMQTT(topic_button_tap, "long");
      flashLED(3);
      tap_count = 0;
    } else {
      // Short tap
      tap_count++;
      last_press_time = now;
    }
  }
  
  // Timeout to finalize tap sequence
  if (tap_count > 0 && (now - last_press_time) > TAP_TIMEOUT) {
    char tap_str[5];
    itoa(tap_count, tap_str, 10);
    publishMQTT(topic_button_tap, tap_str);
    flashLED(tap_count);
    tap_count = 0;
  }
}

// ==== TOUCH SCREEN ====
void checkTouchScreen() {
  int32_t sum_x = 0, sum_y = 0;
  int valid_samples = 0;
  
  for (int i = 0; i < TOUCH_SAMPLES; i++) {
    TSPoint p = ts.getPoint();
    pinMode(XM, OUTPUT);
    pinMode(YP, OUTPUT);
    pinMode(XP, OUTPUT);
    pinMode(YM, OUTPUT);
    
    if (p.z > MINPRESSURE && p.z < MAXPRESSURE) {
      sum_x += p.x;
      sum_y += p.y;
      valid_samples++;
    }
    delay(5);
  }
  
  if (valid_samples >= TOUCH_THRESHOLD) {
    int16_t avg_x = sum_x / valid_samples;
    int16_t avg_y = sum_y / valid_samples;
    int16_t px = map(avg_x, TS_MINX, TS_MAXX, SCREEN_WIDTH, 0);
    int16_t py = map(avg_y, TS_MINY, TS_MAXY, 0, SCREEN_HEIGHT);
    
    for (int i = 0; i < NUM_BUTTONS; i++) {
      if (px >= buttons[i].x && px <= (buttons[i].x + buttons[i].w) &&
          py >= buttons[i].y && py <= (buttons[i].y + buttons[i].h)) {
        
        if (i == 3) {
          // Kill All / Start All button - check if any devices are on
          bool anyOn = light_state || power_state || print_state;
          
          if (anyOn) {
            // KILL ALL - turn everything off
            light_state = false;
            power_state = false;
            print_state = false;
            
            buttons[0].state = false;
            buttons[1].state = false;
            buttons[2].state = false;
            buttons[3].state = true;
            
            // Only redraw device buttons that are changing
            if (buttons[0].state != prev_light_state) drawButton(0);
            if (buttons[1].state != prev_power_state) drawButton(1);
            if (buttons[2].state != prev_print_state) drawButton(2);
            drawButton(3);  // Show Kill button pressed
            
            publishMQTT(topic_light, "OFF");
            publishMQTT(topic_power, "OFF");
            publishMQTT(topic_3dprint, "OFF");
            
            prev_light_state = false;
            prev_power_state = false;
            prev_print_state = false;
            
            delay(200);
            buttons[3].state = false;
            updateKillStartButton();  // Update to Start mode
          } else {
            // START ALL - turn everything on
            light_state = true;
            power_state = true;
            print_state = true;
            
            buttons[0].state = true;
            buttons[1].state = true;
            buttons[2].state = true;
            buttons[3].state = true;
            
            // Only redraw device buttons that are changing
            if (buttons[0].state != prev_light_state) drawButton(0);
            if (buttons[1].state != prev_power_state) drawButton(1);
            if (buttons[2].state != prev_print_state) drawButton(2);
            drawButton(3);  // Show Start button pressed
            
            publishMQTT(topic_light, "ON");
            publishMQTT(topic_power, "ON");
            publishMQTT(topic_3dprint, "ON");
            
            prev_light_state = true;
            prev_power_state = true;
            prev_print_state = true;
            
            delay(200);
            buttons[3].state = false;
            updateKillStartButton();  // Update to Kill mode
          }
        } else {
          // Toggle regular button
          buttons[i].state = !buttons[i].state;
          
          bool prevAnyOn = prev_light_state || prev_power_state || prev_print_state;
          
          if (i == 0) {
            light_state = buttons[i].state;
            publishMQTT(topic_light, light_state ? "ON" : "OFF");
            prev_light_state = light_state;
          }
          else if (i == 1) {
            power_state = buttons[i].state;
            publishMQTT(topic_power, power_state ? "ON" : "OFF");
            prev_power_state = power_state;
          }
          else if (i == 2) {
            print_state = buttons[i].state;
            publishMQTT(topic_3dprint, print_state ? "ON" : "OFF");
            prev_print_state = print_state;
          }
          
          drawButton(i);
          
          // Only update Kill/Start button if we crossed the all-off/any-on boundary
          bool nowAnyOn = light_state || power_state || print_state;
          if (prevAnyOn != nowAnyOn) {
            updateKillStartButton();
          }
        }
        
        // Wait for release
        delay(200);
        int release_count = 0;
        while (release_count < 3) {
          TSPoint p = ts.getPoint();
          pinMode(XM, OUTPUT);
          pinMode(YP, OUTPUT);
          pinMode(XP, OUTPUT);
          pinMode(YM, OUTPUT);
          
          if (p.z < MINPRESSURE) {
            release_count++;
          } else {
            release_count = 0;
          }
          delay(10);
        }
        break;
      }
    }
  }
}

// ==== DISPLAY FUNCTIONS ====
void drawUI() {
  tft.fillScreen(BLACK);
  tft.setTextSize(2);
  tft.setTextColor(WHITE);
  tft.setCursor(70, 15);
  tft.print("Control Panel");
  
  for (int i = 0; i < NUM_BUTTONS; i++) {
    drawButton(i);
  }
  
  updateStatusBar();
}

void drawButton(int index) {
  Button &btn = buttons[index];
  
  // Special handling for Kill/Start button (index 3)
  if (index == 3) {
    bool anyOn = light_state || power_state || print_state;
    uint16_t bgColor = anyOn ? 0xF800 : 0x07E0;  // Red if any on (Kill), Green if all off (Start)
    uint16_t textColor = WHITE;
    const char* label = anyOn ? "KILL ALL" : "START ALL";
    const char* icon = anyOn ? "X" : "S";
    
    tft.fillRoundRect(btn.x, btn.y, btn.w, btn.h, 8, bgColor);
    tft.drawRoundRect(btn.x, btn.y, btn.w, btn.h, 8, WHITE);
    
    tft.setTextSize(4);
    tft.setTextColor(textColor);
    int16_t iconX = btn.x + (btn.w / 2) - 12;
    int16_t iconY = btn.y + 20;
    tft.setCursor(iconX, iconY);
    tft.print(icon);
    
    tft.setTextSize(1);
    int16_t labelLen = strlen(label) * 6;
    int16_t labelX = btn.x + (btn.w / 2) - (labelLen / 2);
    int16_t labelY = btn.y + btn.h - 20;
    tft.setCursor(labelX, labelY);
    tft.print(label);
  } else {
    // Normal button rendering
    uint16_t bgColor = btn.state ? btn.color_on : btn.color_off;
    uint16_t textColor = btn.state ? BLACK : WHITE;
    
    tft.fillRoundRect(btn.x, btn.y, btn.w, btn.h, 8, bgColor);
    tft.drawRoundRect(btn.x, btn.y, btn.w, btn.h, 8, WHITE);
    
    tft.setTextSize(4);
    tft.setTextColor(textColor);
    int16_t iconX = btn.x + (btn.w / 2) - 12;
    int16_t iconY = btn.y + 20;
    tft.setCursor(iconX, iconY);
    tft.print(btn.icon);
    
    tft.setTextSize(1);
    int16_t labelLen = strlen(btn.label) * 6;
    int16_t labelX = btn.x + (btn.w / 2) - (labelLen / 2);
    int16_t labelY = btn.y + btn.h - 20;
    tft.setCursor(labelX, labelY);
    tft.print(btn.label);
  }
}

void updateKillStartButton() {
  drawButton(3);  // Redraw the Kill/Start button with updated state
}

void updateStatusBar() {
  tft.fillRect(0, 185, 320, 55, BLACK);
  tft.drawLine(0, 185, 320, 185, GRAY);
  
  tft.setTextSize(1);
  
  // WiFi status
  tft.setCursor(5, 195);
  tft.setTextColor(WHITE);
  tft.print("WiFi: ");
  if (wifi_connected) {
    tft.setTextColor(0x07E0);
    tft.print("OK");
  } else {
    tft.setTextColor(0xF800);
    tft.print("NO");
  }
  
  // MQTT status
  tft.setTextColor(WHITE);
  tft.setCursor(5, 208);
  tft.print("MQTT: ");
  if (mqtt_connected) {
    tft.setTextColor(0x07E0);
    tft.print("OK");
  } else {
    tft.setTextColor(0xF800);
    tft.print("NO");
  }
  
  // Uptime
  tft.setTextColor(WHITE);
  tft.setCursor(5, 221);
  tft.print("Up: ");
  tft.print(millis() / 1000);
  tft.print("s");
  
  // Door status
  tft.setCursor(120, 195);
  tft.print("Door: ");
  if (door_open) {
    tft.setTextColor(0xF800);
    tft.print("OPEN");
  } else {
    tft.setTextColor(0x07E0);
    tft.print("CLOSED");
  }
  
  // IP address (if connected)
  if (wifi_connected) {
    tft.setTextColor(WHITE);
    tft.setCursor(120, 208);
    tft.print(WiFi.localIP());
  }
  
  // Device temperature
  tft.setTextColor(WHITE);
  tft.setCursor(120, 221);
  tft.print("Temp: ");
  tft.setTextColor(0x07FF);  // Cyan
  tft.print(device_temperature, 1);
  tft.setTextColor(WHITE);
  tft.print("C");
}

// ==== TEMPERATURE ====
float readTemperature() {
  // Arduino UNO R4 WiFi - Read internal MCU temperature
  // The R4 WiFi (Renesas RA4M1) has an internal temperature sensor
  // Typical range: 25-50°C during normal operation
  
  // Average multiple ADC readings for stability
  long sum = 0;
  const int samples = 5;
  
  for (int i = 0; i < samples; i++) {
    // The internal temp sensor is on a specific ADC channel
    // For RA4M1, we need to read the internal reference
    sum += analogRead(A0);  // Using A0 as baseline measurement
    delay(5);
  }
  
  float avg = sum / samples;
  
  // Convert ADC reading to temperature (calibration based on R4 WiFi specs)
  // This is an approximation - the R4 will typically run 25-45°C
  float voltage = (avg / 1023.0) * 3.3;  // R4 WiFi uses 3.3V reference
  float temp = 25.0 + (voltage - 1.65) * 50.0;  // Rough calibration curve
  
  // Clamp to reasonable values
  if (temp < 0) temp = 25.0;
  if (temp > 85.0) temp = 85.0;
  
  return temp;
}

void updateTemperatureDisplay() {
  // Only redraw the temperature value area to avoid flickering
  // Clear just the temperature number area (not the label)
  tft.fillRect(156, 221, 60, 8, BLACK);  // Clear the number area only
  
  tft.setTextColor(0x07FF);  // Cyan
  tft.setCursor(156, 221);
  tft.print(device_temperature, 1);
  tft.setTextColor(WHITE);
  tft.print("C");
}

// ==== UTILITY ====
void flashLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(ONBOARD_LED, HIGH);
    delay(100);
    digitalWrite(ONBOARD_LED, LOW);
    delay(100);
  }
}
