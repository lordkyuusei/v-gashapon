import { post, patch } from "../lib/fetch.js";
import getDocumentRequest from "../services/db/getDocumentRequest.js";
import setDocumentRequest from "../services/db/setDocumentRequest.js";

import { HOUR_IN_MS } from "../lib/constants.js";

export const handleDrawChoice = async (postUrl, patchUrl, member, pick) => {
    const { id } = member.user;

    const document = await getDocumentRequest(id);
    document.cards = [...document.cards, { id: pick }];
    await setDocumentRequest(id, document);

    const interaction_response = await post(postUrl, {
        "type": 4,
        "data": {
            "content": `Félicitations ! ${pick} est désormais dans votre inventaire.`,
        }
    });

    const interaction_edit = await patch(patchUrl, {
        "content": `Vous avez choisi ${pick}. C'est noté.`,
        "components": []
    });

    return { interaction_response, interaction_edit };
}

export const handleDraw = async (url, member) => {
    const { id } = member.user;
    const document = await getDocumentRequest(id);

    const canDraw = document.lastDrawTimestamp + HOUR_IN_MS < Date.now();
    const data = canDraw ? {
        "content": `Commande: Tirer une carte, par <@${member.user.id}>`,
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "style": 1,
                        "label": "Ryushi",
                        "custom_id": "ryushi",
                    },
                    {
                        "type": 2,
                        "style": 2,
                        "label": "Spica",
                        "custom_id": "spicalyce",
                    },
                    {
                        "type": 2,
                        "style": 3,
                        "label": "Savyr",
                        "custom_id": "savyr",
                    },
                ]
            }
        ]
    } : {
        "content": `Vous pourrez tirer une carte dans ${Math.floor((document.lastDrawTimestamp + HOUR_IN_MS - Date.now()) / 60000)} minutes.`,
    }

    if (canDraw) {
        await setDocumentRequest(id, { ...document, lastDrawTimestamp: Date.now() });
    }

    return await post(url, {
        "type": 4,
        data,
    });
}