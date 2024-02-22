import { ADD_BOT_URL } from "../lib/constants.js";

export const home = async (path, res) => {
    const commands = [
        { link: '/add-command', name: 'Add Command' },
        { link: '/del-command', name: 'Delete Command' },
        { link: '/show-command', name: 'Show Command' },
        { link: '/vtubers', name: 'VTubers' },
    ];
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
                };

                a {
                    font-size: 1em;
                    padding: 0.5 1em;
                    border: 1px solid #ccc;
                    borderadius: 1em;
                };
            </style>
        </head>
        <body>
            <div>
                <h1>Commands</h1>
                <ul>
                    ${commands.map(command => `<li><a href="${command.link}">${command.name}</a></li>`).join('')}
                </ul>
            </div>
        </body>
        </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(markup);
    res.end();
}