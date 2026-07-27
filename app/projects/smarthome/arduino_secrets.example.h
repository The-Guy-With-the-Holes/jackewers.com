// Copy this file to arduino_secrets.h and fill in your own values.
// arduino_secrets.h is gitignored and must never be committed.

#ifndef ARDUINO_SECRETS_H
#define ARDUINO_SECRETS_H

// 2.4 GHz network — the Arduino R4 WiFi does not support 5 GHz
#define SECRET_WIFI_SSID   "your-network-name"
#define SECRET_WIFI_PASS   "your-network-password"

// MQTT broker on your local network
#define SECRET_MQTT_BROKER "192.168.1.1"
#define SECRET_MQTT_PORT   1883
#define SECRET_MQTT_USER   "your-mqtt-user"
#define SECRET_MQTT_PASS   "your-mqtt-password"

#endif
