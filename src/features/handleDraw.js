import { post, patch } from "../lib/fetch.js";
import getDocumentRequest from "../services/db/getDocumentRequest.js";
import setDocumentRequest from "../services/db/setDocumentRequest.js";

import { logDatabase } from "../services/db/database.js";

export const handleDrawChoice = async (postUrl, patchUrl, member, pick) => {
    const { id } = member.user;
    await logDatabase("before");

    const document = await getDocumentRequest(id);
    console.log("l12", document)
    document.cards = [...document.cards, { id: pick }];
    console.log("l14", document)
    await setDocumentRequest(id, document);

    await logDatabase("after");

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
    const response = await post(url, {
        "type": 4,
        "data": {
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
        }
    });

    return response;
}