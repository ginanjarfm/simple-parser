const prefix = "00000000";
const postfix = "00008612";
const codecId = "7e";
const hexParts = [];
const avlDataHex = [];
const numberOfRecords = 1;
const eventIOMeta = {
  numberOfTotalID: 0,
  n1OfOneByteIO: 0,
  n2OfTwoBytesIO: 0,
  n4OfFourBytesIO: 0,
  n8OfEightBytesIO: 0,
  nXOfXBytesIO: 0
};
const eventIOsMap = new Map();

function countIOsByLength(length) {
  return eventIOsMap.size - Array.from(
    eventIOsMap.values()
  ).filter(io => io.ioLength !== length).length;
}

function insertEventIO(ioID, ioValue, ioLength = 1) {
  const existingIO = eventIOsMap.get(ioID);
  if (existingIO) {
    existingIO.ioValue = ioValue;
    existingIO.ioLength = ioLength;
  } else {
    eventIOsMap.set(ioID, { ioID, ioValue, ioLength });
  }

  updateEventIOMeta();
}

function updateEventIOMeta() {
  eventIOMeta.numberOfTotalID = eventIOsMap.size;
  eventIOMeta.n1OfOneByteIO = countIOsByLength(1);
  eventIOMeta.n2OfTwoBytesIO = countIOsByLength(2);
  eventIOMeta.n4OfFourBytesIO = countIOsByLength(4);
  eventIOMeta.n8OfEightBytesIO = countIOsByLength(8);
  eventIOMeta.nXOfXBytesIO = eventIOsMap.size - (
    eventIOMeta.n1OfOneByteIO
    + eventIOMeta.n2OfTwoBytesIO
    + eventIOMeta.n4OfFourBytesIO
    + eventIOMeta.n8OfEightBytesIO
  );
}

function toHexString() {
  hexParts.push(prefix);
  const eventIOID = '';
  avlDataHex.push(codecId);
  avlDataHex.push(numberOfRecords.toString(16).padStart(2, '0'));
  const avlData = [{
    timestamp: new Date(),
    eventIOID: eventIOID,
    eventIOMeta: eventIOMeta,
    eventIOs: Array.from(eventIOsMap.values())
  }];

  avlData.forEach(avlRecord => {
    avlDataHex.push(avlRecord.timestamp.getTime().toString(16).padStart(16, '0'));
    avlDataHex.push(avlRecord.eventIOID.toString(16).padStart(4, '0'));
    avlDataHex.push(avlRecord.eventIOMeta.numberOfTotalID.toString(16).padStart(4, '0'));
    avlDataHex.push(avlRecord.eventIOMeta.n1OfOneByteIO.toString(16).padStart(4, '0'));
    avlRecord.eventIOs.filter(io => io.ioLength === 1).forEach(io => {
      avlDataHex.push(io.ioID.toString(16).padStart(4, '0'));
      avlDataHex.push(io.ioValue.toString(16).padStart(2, '0'));
    });
    avlDataHex.push(avlRecord.eventIOMeta.n2OfTwoBytesIO.toString(16).padStart(4, '0'));
    avlRecord.eventIOs.filter(io => io.ioLength === 2).forEach(io => {
      avlDataHex.push(io.ioID.toString(16).padStart(4, '0'));
      avlDataHex.push(io.ioValue.toString(16).padStart(4, '0'));
    });
    avlDataHex.push(avlRecord.eventIOMeta.n4OfFourBytesIO.toString(16).padStart(4, '0'));
    avlRecord.eventIOs.filter(io => io.ioLength === 4).forEach(io => {
      avlDataHex.push(io.ioID.toString(16).padStart(4, '0'));
      avlDataHex.push(io.ioValue.toString(16).padStart(8, '0'));
    });
    avlDataHex.push(avlRecord.eventIOMeta.n8OfEightBytesIO.toString(16).padStart(4, '0'));
    avlRecord.eventIOs.filter(io => io.ioLength === 8).forEach(io => {
      avlDataHex.push(io.ioID.toString(16).padStart(4, '0'));
      avlDataHex.push(io.ioValue.toString(16).padStart(16, '0'));
    });
    if (codecId === '7e') {
      avlDataHex.push(avlRecord.eventIOMeta.nXOfXBytesIO.toString(16).padStart(4, '0'));
      avlRecord.eventIOs.filter(io => ![1, 2, 4, 8].includes(io.ioLength)).forEach(io => {
        avlDataHex.push(io.ioID.toString(16).padStart(4, '0'));
        avlDataHex.push(io.ioLength.toString(16).padStart(4, '0'));
        avlDataHex.push(io.ioValue.toString(16).padStart(io.ioLength * 2, '0'));
      });
    }
  });
  hexParts.push(avlDataHex.length.toString(16).padStart(8, '0'));
  hexParts.push(...avlDataHex);
  hexParts.push(numberOfRecords.toString(16).padStart(2, '0'));
  hexParts.push(postfix);
  return hexParts.join('');
}

module.exports = { insertEventIO, toHexString };
