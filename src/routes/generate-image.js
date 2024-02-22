export const generateImageView = (req, res) => {
    const [, url, vtuber, variant] = req.url.split('/');

    const markup = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    margin: 0;
                }

                img {
                    grid-area: 1 / 1 / 1 / 1;
                    aspect-ratio: 6/10;
                    height: 100svh;
                }
            </style>
        </head>
        <body>
            <div style="display: grid; grid-template: 1fr / 1fr">
                <img src="/characters/${vtuber}/${vtuber}_fond.png">
                <img src="/characters/${vtuber}/${vtuber}.png">
                <img src="/backgrounds/${variant}.png">
            </div>
        </body>
        </html>
    `

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(markup);
    res.end();
}