export const home = (path, res) => {
    const markup = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    gap: 1em;
                }
                button {
                    font-size: 1em;
                    padding: 0.5 1em;
                    border: 1px solid #ccc;
                    borderadius: 1em;
                }
            </style>
        </head>
        <body>
            <div>
                <a href="/add-command"><button id="add-command">Add Command</button></a>
                <a href="/show-command"><button id="show-command">Show Command</button></a>
                <a href="/del-command"><button id="del-command">Delete Command</button></a>
            </div>
        </body>
        </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(markup);
    res.end();
}