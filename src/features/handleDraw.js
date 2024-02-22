import { post, patch, _postForm } from "../lib/fetch.js";
import getDocumentRequest from "../services/db/getDocumentRequest.js";
import setDocumentRequest from "../services/db/setDocumentRequest.js";

import { HOUR_IN_MS, KYUUSEI_ID, VARIANTS_ID, VTUBERS_ID } from "../lib/constants.js";
import { generateImage } from '../lib/generate-image.js';

const drawThreeVtubers = async () => {
    const length = 3;
    const vtubers = await getDocumentRequest(VTUBERS_ID);
    const variants = await getDocumentRequest(VARIANTS_ID);

    const cardLimit = vtubers.cards.length - 1;
    const variantLimit = variants.variants.length - 1;

    const drawedCards = Array.from({ length }, () => Math.floor(Math.random() * cardLimit) + 1);
    const variant = variants.variants.find(x => x.id === 'white');

    return [
        drawedCards.map(x => vtubers.cards[x]),
        variant
    ];
}

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
    const canDraw = document.lastDrawTimestamp + HOUR_IN_MS < Date.now() || id === KYUUSEI_ID;

    if (canDraw) {
        await setDocumentRequest(id, { ...document, lastDrawTimestamp: Date.now() });

        const [cards, variant] = await drawThreeVtubers();
        const formData = new FormData();
        formData.append("payload_json", JSON.stringify({
            "type": 4,
            "data": {
                "content": `Commande: Tirer une carte, par <@${member.user.id}>`,
                "components": [
                    {
                        "type": 1,
                        "components": cards.map((card, i) => ({
                            "type": 2,
                            "style": i + 1,
                            "label": `${card.id} - ${variant.id}`,
                            "custom_id": `${card.id}-${variant.id}`,
                        }))
                    }
                ],
                "embeds": cards.map((card, i) => {
                    const image = {
                        "url": "http://example.com",
                        "image": { url: `attachment://${card.id}-${variant.id}.png` }
                    };

                    return i === 0 ? {
                        "title": "Résultat du tirage",
                        "description": "Choississez une carte parmis celles suivantes",
                        ...image
                    } : image
                }),
            }
        }))

        const fileData = await generateImage(cards, variant);

        for (let i = 0; i < cards.length; i++) {
            const blob = new Blob([fileData[i]], { type: 'image/png' });
            formData.append(`file${i + 1}`, blob, `${cards[i].id}-${variant.id}.png`);
        }

        return await _postForm(url, formData);
    } else {
        return await post(url, {
            "type": 4,
            "data": {
                "content": `Vous pourrez tirer une carte dans ${Math.floor((document.lastDrawTimestamp + HOUR_IN_MS - Date.now()) / 60000)} minutes.`,
            }
        });
    }

}