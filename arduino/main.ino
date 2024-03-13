#include "event_io.h"

void setup() {
  Serial.begin(9600);
  insertEventIO(0x71, 0x01, 1);
  insertEventIO(0x72, 0x01, 1);
  insertEventIO(0x73, 0x0002, 2);
  insertEventIO(0x74, 0x0002, 2);
}

void loop() {
  String hexString = toHexString();
  Serial.println(hexString);
  delay(1000); // Example delay
}
