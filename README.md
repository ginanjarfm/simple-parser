# Simple Parser

This repository contains a simple parser project for simulating and parsing data. It includes implementations in Arduino and JavaScript.

## Arduino

The `arduino` directory contains an example library for creating and simulating data send using Arduino. This library demonstrates how to generate simulated data and send it using Arduino hardware.

## Script

The `script` directory contains a JavaScript version of the parser. Additionally, it includes `server.js` which provides a simple parser implementation.

To test the parser, you can call `parseHexString` and provide hex data to it. For example:

```javascript
const { parseHexString } = require("./server");
const data = "00000000000000127e010000018e36d2da74000000040002004701004801000200490002004a00020000000000000100008612";
console.log(JSON.stringify(parseHexString(data), null, 2));
```

## EventIO Data Types Example

| EventIO ID | Data Type          | Length |
|------------|--------------------|--------|
| 71         | Integer            | 1      |
| 72         | Integer            | 1      |
| 73         | IntMultiply01      | 2      |
| 74         | IntMultiply01      | 2      |


## Usage

Clone this repository to your local machine:

```
git clone git@github.com:ginanjarfm/simple-parser.git
```

Navigate to the cloned directory:

```
cd simple-parser
```

Explore the respective directories for Arduino and JavaScript implementations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
