
const imeiInput = "356307042441013"; //15 bytes
const imeiData = Buffer.from(imeiInput, 'ascii').toString('hex').toUpperCase()
console.log('Buffer: ', Buffer.from(imeiData, "hex"));
const imeiBuffer = Buffer.from(imeiData, "hex");
const imei = imeiBuffer.toString("utf-8");
console.log(imei);

console.log();

const intInput = 1; //1 bytes
const intData = intInput.toString(16).padStart(2, '0');
console.log('Buffer: ', Buffer.from(intData, "hex"));
const intX = parseInt(intData, 16);
console.log(intX);

console.log();

const fInput = 245; //2 bytes
const fData = fInput.toString(16).padStart(4, '0');
console.log('Buffer: ', Buffer.from(fData, "hex"));
const intF = parseInt(fData, 16) * 0.1;
console.log(intF);

console.log();

const nInput = "B9007JFK"; //8 bytes
const nData = Buffer.from(nInput, 'ascii').toString('hex').toUpperCase();
console.log('Buffer: ', Buffer.from(nData, "hex"));
const nBuffer = Buffer.from(nData, "hex");
const nopol = nBuffer.toString("utf-8");
console.log(nopol);
