#include "event_io.h"
#include <iostream>

void testInsertEventIO();
void testToHexString();

int main()
{
  testInsertEventIO();
  testToHexString();

  return 0;
}

void testInsertEventIO()
{
  insertEventIO(71, 1, 1);
  insertEventIO(72, 1, 1);
  insertEventIO(73, 2, 2);
  insertEventIO(74, 2, 2);
}

void testToHexString()
{
  std::string hexString = toHexString();
  std::cout << hexString << std::endl;
}
