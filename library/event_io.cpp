#include "event_io.h"

const char *prefix = "00000000";
const char *postfix = "00008612";
const char *codecId = "7e";
const int maxIOs = 100;

int numberOfRecords = 1;
std::string eventIOID = "";

EventIOMeta eventIOMeta;
std::vector<EventIO> eventIOs;

int countIOsByLength(int length)
{
  int count = 0;
  for (const auto &eventIO : eventIOs)
  {
    if (eventIO.ioLength == length)
    {
      count++;
    }
  }
  return count;
}

int countIOsByLengthX()
{
  int count = 0;
  for (const auto &eventIO : eventIOs)
  {
    if (eventIO.ioLength != 1 && eventIO.ioLength != 2 && eventIO.ioLength != 4 && eventIO.ioLength != 8)
    {
      count++;
    }
  }
  return count;
}

void insertEventIO(int ioID, int ioValue, int ioLength)
{
  bool found = false;
  for (auto &eventIO : eventIOs)
  {
    if (eventIO.ioID == ioID)
    {
      eventIO.ioValue = ioValue;
      eventIO.ioLength = ioLength;
      found = true;
      break;
    }
  }
  if (!found)
  {
    eventIOs.push_back({ioID, ioValue, ioLength});
    eventIOMeta.numberOfTotalID++;
  }
  eventIOMeta.n1OfOneByteIO = countIOsByLength(1);
  eventIOMeta.n2OfTwoBytesIO = countIOsByLength(2);
  eventIOMeta.n4OfFourBytesIO = countIOsByLength(4);
  eventIOMeta.n8OfEightBytesIO = countIOsByLength(8);
  eventIOMeta.nXOfXBytesIO = countIOsByLengthX();
}

std::string toHexString()
{
  std::ostringstream hexData;
  std::ostringstream avlDataHex;

  std::vector<AvlData> avlData;

  AvlData data{
    std::chrono::system_clock::now(),
    eventIOID,
    eventIOMeta,
    std::vector<EventIO>(eventIOs.begin(), eventIOs.end())
  };

  avlData.push_back(data);

  for (const auto &avl : avlData)
  {
    avlDataHex << std::setfill('0') << std::setw(16) << std::hex << avl.getTimestamp();
    avlDataHex << std::setfill('0') << std::setw(4) << std::hex << avl.eventIOID;
    avlDataHex << std::setfill('0') << std::setw(4) << std::hex << avl.eventIOMeta.numberOfTotalID;

    avlDataHex << std::setfill('0') << std::setw(4) << std::hex << avl.eventIOMeta.n1OfOneByteIO;
    for (const auto &eventIO : avl.eventIOs)
    {
      if (eventIO.ioLength == 1)
      {
        avlDataHex << std::setw(4) << std::hex << eventIO.ioID;
        avlDataHex << std::setw(2) << std::hex << eventIO.ioValue;
      }
    }
    avlDataHex << std::setfill('0') << std::setw(4) << std::hex << avl.eventIOMeta.n2OfTwoBytesIO;
    for (const auto &eventIO : avl.eventIOs)
    {
      if (eventIO.ioLength == 2)
      {
        avlDataHex << std::setw(4) << std::hex << eventIO.ioID;
        avlDataHex << std::setw(4) << std::hex << eventIO.ioValue;
      }
    }
    avlDataHex << std::setfill('0') << std::setw(4) << std::hex << avl.eventIOMeta.n4OfFourBytesIO;
    for (const auto &eventIO : avl.eventIOs)
    {
      if (eventIO.ioLength == 4)
      {
        avlDataHex << std::setw(4) << std::hex << eventIO.ioID;
        avlDataHex << std::setw(8) << std::hex << eventIO.ioValue;
      }
    }
    avlDataHex << std::setfill('0') << std::setw(4) << std::hex << avl.eventIOMeta.n8OfEightBytesIO;
    for (const auto &eventIO : avl.eventIOs)
    {
      if (eventIO.ioLength == 8)
      {
        avlDataHex << std::setw(4) << std::hex << eventIO.ioID;
        avlDataHex << std::setw(16) << std::hex << eventIO.ioValue;
      }
    }
    if (std::string(codecId) == "7e")
    {
      avlDataHex << std::setw(4) << std::hex << avl.eventIOMeta.nXOfXBytesIO;

      for (const auto &eventIO : avl.eventIOs)
      {
        if (!(eventIO.ioLength == 1 || eventIO.ioLength == 2 || eventIO.ioLength == 4 || eventIO.ioLength == 8))
        {
          avlDataHex << std::setw(4) << std::hex << eventIO.ioID;
          avlDataHex << std::setw(4) << std::hex << eventIO.ioLength;
          avlDataHex << std::setw(eventIO.ioLength * 2) << std::hex << eventIO.ioValue;
        }
      }
    }
  }

  hexData << prefix;
  hexData << std::setfill('0') << std::setw(8) << std::hex << avlDataHex.str().length() / 2;
  hexData << codecId;
  hexData << std::setfill('0') << std::setw(2) << std::hex << numberOfRecords;
  hexData << avlDataHex.str();
  hexData << std::setfill('0') << std::setw(2) << std::hex << numberOfRecords;
  hexData << postfix;

  return hexData.str();
}
