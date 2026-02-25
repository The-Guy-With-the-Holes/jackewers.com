# Year in Review - Theme Reference

This document contains preset themes you can use for different albums and seasons.

## How to Apply a Theme

Add these CSS variables to your HTML file, either in an inline `<style>` tag or by overriding the `:root` variables:

```css
:root {
    --theme-accent: #color;
    --theme-logo-from: #color;
    --theme-logo-to: #color;
}
```

Then update:
- The `.logo` emoji in the header
- The h1 seasonal icon
- The h1 `.seasonal-text` content

---

## Available Themes

### 🎄 Christmas (December)
```css
--theme-accent: #c2410c;
--theme-logo-from: #7c2d12;
--theme-logo-to: #ff7a18;
```
- **Logo emoji**: 🎄
- **H1 icon**: 🎄
- **Seasonal text**: "A Christmas Story"

---

### 🎆 New Year (January)
```css
--theme-accent: #fbbf24;
--theme-logo-from: #7c2d12;
--theme-logo-to: #fbbf24;
```
- **Logo emoji**: 🎆
- **H1 icon**: 🎆
- **Seasonal text**: "Starting Strong"

---

### 🌸 Spring (March-May)
```css
--theme-accent: #10b981;
--theme-logo-from: #059669;
--theme-logo-to: #34d399;
```
- **Logo emoji**: 🌸
- **H1 icon**: 🌸
- **Seasonal text**: "Spring Awakening"

---

### ☀️ Summer (June-August)
```css
--theme-accent: #f59e0b;
--theme-logo-from: #d97706;
--theme-logo-to: #fbbf24;
```
- **Logo emoji**: ☀️
- **H1 icon**: ☀️
- **Seasonal text**: "Summer Adventures"

---

### 🍂 Autumn (September-November)
```css
--theme-accent: #ea580c;
--theme-logo-from: #9a3412;
--theme-logo-to: #fb923c;
```
- **Logo emoji**: 🍂
- **H1 icon**: 🍂
- **Seasonal text**: "Autumn Memories"

---

### 🎂 Birthday
```css
--theme-accent: #ec4899;
--theme-logo-from: #db2777;
--theme-logo-to: #f472b6;
```
- **Logo emoji**: 🎂
- **H1 icon**: 🎂
- **Seasonal text**: "Birthday Celebration"

---

## Custom Themes

Feel free to create your own! Just pick:
1. An **accent color** for highlights and buttons
2. A **gradient start color** for the logo
3. A **gradient end color** for the logo
4. An appropriate **emoji**
5. Descriptive **seasonal text**

Example - 🎃 Halloween:
```css
--theme-accent: #f97316;
--theme-logo-from: #7c2d12;
--theme-logo-to: #f97316;
```
