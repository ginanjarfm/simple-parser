#include <WiFi.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverAddress = "192.168.1.100"; // IP address of the server
const int serverPort = 3000;

WiFiClient client;

const String loginData = "0006333041454134303730443634";
const String sampleData = "00000000000000247e010000018e3d452df5000000040002004701004801000200490002004a00020000000000000100008612";

bool isLoggedIn = false;

void setup() {
  Serial.begin(9600);
  delay(100);

  connectToWiFi();
}

void loop() {
  if (!client.connected()) {
    if (!client.connect(serverAddress, serverPort)) {
      Serial.println("Connection to server failed");
      delay(5000);
      return;
    }
    Serial.println("Connected to server");
  }

  if (client.available()) {
    String data = "";
    while (client.available()) {
      char c = client.read();
      data += c;
    }
    Serial.print("Received from server: ");
    Serial.println(data);

    int intValue = strtol(data, NULL, 16);
    if (intValue == 1) {
      isLoggedIn = true;
      Serial.println("isLoggedIn is now true");
    }
  }

  if (!isLoggedIn) {
    login(loginData);
  } else {
    sendDataToServer(sampleData);
  }

  delay(5000);
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void login(String data) {
  Serial.println("Sending login data");
  client.print(data);
  isLoggedIn = true;
}

void sendDataToServer(String data) {
  Serial.println("Sending sensor data");
  client.print(data);
}
