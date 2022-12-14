import getDocumentRequest from "../services/db/getDocumentRequest.js";
import setDocumentRequest from "../services/db/setDocumentRequest.js";

import { post } from "../lib/fetch.js";

const handleBurn = async (url, member, { name, options }) => {
    const { options: params } = options[0];

    const document = await getDocumentRequest(member.user.id);
    const random = Math.floor(Math.random() * 20) + 1;

    await setDocumentRequest(member.user.id, {
        ...document,
        cards: document.cards.filter(card => card.id !== params[0].value),
        points: document.points + random
    });

    const response = await post(url, {
        "type": 4,
        "data": {
            "content": `Commande: Brûler une carte (code: ${params[0].value}), par <@${member.user.id}>. Cela vous a rapporté ${random} points.`,
        }
    });

    return response;
}

export default handleBurn;