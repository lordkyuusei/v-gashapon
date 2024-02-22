import { VTUBERS_ID } from "../lib/constants.js";
import getDocumentRequest from '../services/db/getDocumentRequest.js';

export const showVtubers = async (req, res) => {
    const { cards } = await getDocumentRequest(VTUBERS_ID);

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
                    width: 100%;
                    gap: 1em;
                }
            </style>
        </head>
        <body>
            <div>
                <h1>VTubers</h1>
                <ul>
                    ${cards.map(card => `<li>${card.id}</li>`).join('')}
                </ul>
            </div>
        </body>
        </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(markup);
    res.end();
};