#include "event_io.h"
#include <WiFi.h>

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const char* serverIP = "192.168.1.100"; // Change this to your server's IP address
const int serverPort = 1234; // Change this to your server's port

WiFiClient client;

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  insertEventIO(71, 1, 1);
  insertEventIO(72, 1, 1);
  insertEventIO(73, 2, 2);
  insertEventIO(74, 2, 2);
}

void loop() {
  String hexString = toHexString();

  uint8_t buffer[hexString.length() / 2];
  for (int i = 0; i < hexString.length(); i += 2) {
    buffer[i / 2] = strtoul(hexString.substring(i, i + 2).c_str(), NULL, 16);
  }

  if (!client.connected()) {
    if (!client.connect(serverIP, serverPort)) {
      delay(1000);
      return;
    }
  }

  if (client.connected()) {
    client.write(buffer, sizeof(buffer));
  } else {
    client.stop();
  }

  delay(1000);
}
