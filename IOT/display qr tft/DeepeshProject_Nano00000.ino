#include <MCUFRIEND_kbv.h>
#include <qrcode.h>
#include <Adafruit_GFX.h> // Required by MCUFRIEND_kbv

#define BLACK   0xFFFF

#define WHITE   0x0000

MCUFRIEND_kbv tft;

void setup() {
  Serial.begin(9600);
  uint16_t ID = tft.readID();
  tft.begin(ID);
  tft.setRotation(1);
  tft.fillScreen(BLACK);

  // Heading text
  tft.setTextColor(WHITE);
  tft.setTextSize(2);
  tft.setCursor(50, 10);
  tft.print("^-^ CIRCLO SCAN ME");

  // QR code setup
  QRCode qrcode;
  uint8_t version = 3; // Version 3 = 29x29
  int scale = 5;       // Increased scale for bigger QR
  int qrSize = 29;     // For version 3
  int qrPixelSize = qrSize * scale;

  

  uint8_t qrcodeData[qrcode_getBufferSize(version)];
  qrcode_initText(&qrcode, qrcodeData, version, ECC_LOW, "http://192.168.47.22:8080/");

  // Center the QR code
  int screenWidth = 320;
  int screenHeight = 240;
  int offsetX = (screenWidth - qrPixelSize) / 2;
  int offsetY = 50; // Positioned below the heading

  // Draw the QR code
  for (uint8_t y = 0; y < qrcode.size; y++) {
    for (uint8_t x = 0; x < qrcode.size; x++) {
      uint16_t color = qrcode_getModule(&qrcode, x, y) ? WHITE : BLACK;
      tft.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale, color);
    }
  }
}

void loop() {
  // Nothing here
}
