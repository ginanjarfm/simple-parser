function sortingHat(key, value) {
  function parseSignedDataInteger(data) {
    return parseInt((parseInt(data, 16) << 0).toString(10), 10);
  }

  function parseSignedDataFloat(data) {
    return parseInt((parseInt(data, 16) << 0).toString(10), 10) / 1000;
  }

  function parseDataInteger(data) {
    return parseInt(data, 16);
  }

  function parseDataFloat(data) {
    return parseInt(data, 16) / 1000;
  }

  function intMultiply01(data) {
    return parseDataInteger(data) * 0.1;
  }

  function intMultiply001(data) {
    return parseDataInteger(data) * 0.01;
  }

  function intMultiply0001(data) {
    return parseDataInteger(data) * 0.001;
  }

  function signedNoMultiply(data) {
    if (!data) return 0;
    const uint8Array = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const view = new DataView(uint8Array.buffer);
    return view.getInt16(0);
  }

  const parseFunctionsDictionary = {
    71: parseDataInteger,
    72: parseDataInteger,
    73: intMultiply01,
    74: intMultiply01,
  };

  const parseFunction = parseFunctionsDictionary[key];
  return parseFunction ? parseFunction(value) : `0x${value}`;
}

function parseHexString(hexData) {
  function parseHexToInteger(hex) {
    return parseInt(hex, 16);
  }

  function parseHexToSignedDecimal(hexString) {
    const decimalValue = (parseInt(hexString, 16) << 0).toString(10);
    return decimalValue;
  }

  const parsedData = {};
  parsedData.zeroBytes = hexData.slice(0, 8);
  parsedData.dataFieldLength = parseHexToInteger(hexData.slice(8, 16));
  parsedData.codecID = hexData.slice(16, 18);
  parsedData.numberOfRecords = parseHexToInteger(hexData.slice(18, 20));

  const extMtply = parsedData.codecID === '7e' ? 4 : 2;
  let index = 20;
  parsedData.avlData = [];

  for (let record = 0; record < parsedData.numberOfRecords; record++) {
    const avlRecord = {};

    avlRecord.timestamp = new Date(parseHexToInteger(hexData.slice(index, index + 16)));
    index += 16;
    avlRecord.eventIOID = parseHexToInteger(hexData.slice(index, index + extMtply));
    index += extMtply;

    const numberOfTotalID = parseHexToInteger(hexData.slice(index, index + extMtply));
    index += extMtply;

    avlRecord.eventIOs = [];

    const n1OfOneByteIO = parseHexToInteger(hexData.slice(index, index + extMtply));
    index += extMtply;

    for (let i = 0; i < n1OfOneByteIO; i++) {
      const ioID = parseHexToInteger(hexData.slice(index, index + extMtply));
      index += extMtply;
      const ioLength = 1;
      const ioValue = sortingHat(ioID, hexData.slice(index, index + 2));
      index += 2;
      avlRecord.eventIOs.push({ ioID, ioValue, ioLength });
    }

    const n2OfTwoBytesIO = parseHexToInteger(hexData.slice(index, index + extMtply));
    index += extMtply;

    for (let i = 0; i < n2OfTwoBytesIO; i++) {
      const ioID = parseHexToInteger(hexData.slice(index, index + extMtply));
      index += extMtply;
      const ioLength = 2;
      const ioValue = sortingHat(ioID, hexData.slice(index, index + 4));
      index += 4;
      avlRecord.eventIOs.push({ ioID, ioValue, ioLength });
    }

    const n4OfFourBytesIO = parseHexToInteger(hexData.slice(index, index + extMtply));
    index += extMtply;

    for (let i = 0; i < n4OfFourBytesIO; i++) {
      const ioID = parseHexToInteger(hexData.slice(index, index + extMtply));
      index += extMtply;
      const ioLength = 4;
      const ioValue = sortingHat(ioID, hexData.slice(index, index + 8));
      index += 8;
      avlRecord.eventIOs.push({ ioID, ioValue, ioLength });
    }

    const n8OfEightBytesIO = parseHexToInteger(hexData.slice(index, index + extMtply));
    index += extMtply;

    for (let i = 0; i < n8OfEightBytesIO; i++) {
      const ioID = parseHexToInteger(hexData.slice(index, index + extMtply));
      index += extMtply;
      const ioLength = 8;
      const ioValue = sortingHat(ioID, hexData.slice(index, index + 16));
      index += 16;
      avlRecord.eventIOs.push({ ioID, ioValue, ioLength });
    }

    avlRecord.eventIOMeta = {
      numberOfTotalID,
      n1OfOneByteIO,
      n2OfTwoBytesIO,
      n4OfFourBytesIO,
      n8OfEightBytesIO,
    };

    if (parsedData.codecID === '7e') {
      const nXOfXBytesIO = parseHexToInteger(hexData.slice(index, index + extMtply));
      index += extMtply;

      for (let i = 0; i < nXOfXBytesIO; i++) {
        const ioID = parseHexToInteger(hexData.slice(index, index + extMtply));
        index += extMtply;
        const ioLength = parseHexToInteger(hexData.slice(index, index + extMtply));
        index += extMtply;
        const ioValue = sortingHat(ioID, hexData.slice(index, index + (ioLength * 2)));
        index += (ioLength * 2);
        avlRecord.eventIOs.push({ ioID, ioValue, ioLength });
      }

      avlRecord.eventIOMeta.nXOfXBytesIO = nXOfXBytesIO;
    }

    const hasNaNInEventIOs = avlRecord.eventIOs.some(
      (eventIO) => isNaN(eventIO.ioValue) || isNaN(eventIO.ioID)
    );

    const hasNaNInEventIOMeta = Object.values(avlRecord.eventIOMeta).some((value) =>
      isNaN(value)
    );

    const hasNaNInAttributes = Object.keys(avlRecord).some((key) => {
      if (key !== 'eventIOs' && key !== 'eventIOMeta') {
        return isNaN(avlRecord[key]);
      }
      return false;
    });

    if (!hasNaNInEventIOs && !hasNaNInEventIOMeta && !hasNaNInAttributes) {
      parsedData.avlData.push(avlRecord);
    } else {
      console.error(`Has NaN on eventIOs: ${hasNaNInEventIOs}, eventIOMeta: ${hasNaNInEventIOMeta}, attributes: ${hasNaNInAttributes}`)
    }
  }

  parsedData.numberOfData2 = parseHexToInteger(hexData.slice(index, index + 2));
  index += 2;
  parsedData.crc16 = hexData.slice(index, index + 8);

  if (parsedData.numberOfData2 !== parsedData.numberOfRecords) {
    parsedData.avlData.forEach((avlRecord) => {
      avlRecord.eventIOMeta.numberOfRecords = parsedData.numberOfRecords;
      avlRecord.eventIOMeta.numberOfData2 = parsedData.numberOfData2;
      avlRecord.eventIOMeta.hexData = {
        hexData
      }
    });
  }

  return parsedData;
}

module.exports = { parseHexString };
