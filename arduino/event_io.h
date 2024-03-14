#ifndef EVENT_IO_H
#define EVENT_IO_H

#include <string>
#include <vector>
#include <iomanip>
#include <sstream>
#include <ctime>

extern const char *prefix;
extern const char *postfix;
extern const char *codecId;
extern const int maxIOs;

extern int numberOfRecords;

struct EventIOMeta
{
  int numberOfTotalID;
  int n1OfOneByteIO;
  int n2OfTwoBytesIO;
  int n4OfFourBytesIO;
  int n8OfEightBytesIO;
  int nXOfXBytesIO;
};

struct EventIO
{
  int ioID;
  int ioValue;
  int ioLength;
};

struct AvlData
{
  std::chrono::system_clock::time_point timestamp;
  std::string eventIOID;
  EventIOMeta eventIOMeta;
  std::vector<EventIO> eventIOs;

  long long getTimestamp() const
  {
    auto durationSinceEpoch = timestamp.time_since_epoch();
    return std::chrono::duration_cast<std::chrono::milliseconds>(durationSinceEpoch).count();
  }
};

extern EventIOMeta eventIOMeta;
extern std::vector<EventIO> eventIOs;

int countIOsByLength(int length);
int countIOsByLengthX();
void insertEventIO(int ioID, int ioValue, int ioLength = 1);
std::string toHexString();

#endif
