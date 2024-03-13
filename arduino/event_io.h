#ifndef EVENT_IO_H
#define EVENT_IO_H

#include <Arduino.h>

extern const char* prefix;
extern const char* postfix;
extern const char* codecId;
extern const int maxIOs;

extern int numberOfRecords;

struct EventIOMeta {
  int numberOfTotalID;
  int n1OfOneByteIO;
  int n2OfTwoBytesIO;
  int n4OfFourBytesIO;
  int n8OfEightBytesIO;
  int nXOfXBytesIO;
};

struct EventIO {
  int ioID;
  int ioValue;
  int ioLength;
};

extern EventIOMeta eventIOMeta;
extern EventIO eventIOs[];

int countIOsByLength(int length);
int countIOsByLengthX();
void insertEventIO(int ioID, int ioValue, int ioLength = 1);
String toHexString();

#endif
