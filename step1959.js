const fs = require('fs');

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
        return null;
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
}

console.log(getPngDimensions('cert_background_new.png'));