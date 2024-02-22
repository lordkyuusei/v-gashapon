import * as fs from 'node:fs/promises';

export const showImageView = async (req, res) => {
    var img = await fs.readFile('static' + req.url);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(img, 'binary');
}