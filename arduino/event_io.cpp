#include "event_io.h"

const char* prefix = "00000000";
const char* postfix = "00008612";
const char* codecId = "7e";
const int maxIOs = 100;

int numberOfRecords = 1;
EventIOMeta eventIOMeta;
EventIO eventIOs[maxIOs];

int countIOsByLength(int length) {
  int count = 0;
  for (int i = 0; i < eventIOMeta.numberOfTotalID; ++i) {
    if (eventIOs[i].ioLength == length) {
      count++;
    }
  }
  return count;
}

int countIOsByLengthX() {
  int count = 0;
  for (int i = 0; i < eventIOMeta.numberOfTotalID; ++i) {
    if (eventIOs[i].ioLength != 1 && eventIOs[i].ioLength != 2 && eventIOs[i].ioLength != 4 && eventIOs[i].ioLength != 8) {
      count++;
    }
  }
  return count;
}

void insertEventIO(int ioID, int ioValue, int ioLength) {
  bool found = false;
  for (int i = 0; i < eventIOMeta.numberOfTotalID; ++i) {
    if (eventIOs[i].ioID == ioID) {
      eventIOs[i].ioValue = ioValue;
      eventIOs[i].ioLength = ioLength;
      found = true;
      break;
    }
  }
  if (!found) {
    eventIOs[eventIOMeta.numberOfTotalID].ioID = ioID;
    eventIOs[eventIOMeta.numberOfTotalID].ioValue = ioValue;
    eventIOs[eventIOMeta.numberOfTotalID].ioLength = ioLength;
    eventIOMeta.numberOfTotalID++;
  }
  eventIOMeta.n1OfOneByteIO = countIOsByLength(1);
  eventIOMeta.n2OfTwoBytesIO = countIOsByLength(2);
  eventIOMeta.n4OfFourBytesIO = countIOsByLength(4);
  eventIOMeta.n8OfEightBytesIO = countIOsByLength(8);
  eventIOMeta.nXOfXBytesIO = countIOsByLengthX();
}

String toHexString() {
  String hexData = "";
  hexData += prefix;
  String eventIOID = "";
  hexData += codecId;
  hexData += String(numberOfRecords, HEX);
  String avlDataHex = "";
  avlDataHex += codecId;
  avlDataHex += String(numberOfRecords, HEX);
  for (int i = 0; i < eventIOMeta.numberOfTotalID; ++i) {
    avlDataHex += String(eventIOs[i].ioValue, HEX);
  }
  hexData += String(avlDataHex.length(), HEX);
  hexData += avlDataHex;
  hexData += String(numberOfRecords, HEX);
  hexData += postfix;
  return hexData;
}
