import { post, patch, postForm, patchForm } from "../lib/fetch.js";
import getDocumentRequest from "../services/db/getDocumentRequest.js";
import setDocumentRequest from "../services/db/setDocumentRequest.js";

import { HOUR_IN_MS, KYUUSEI_ID, VARIANTS_ID, VTUBERS_ID } from "../lib/constants.js";
import { generateImage } from '../lib/generate-image.js';

const drawVtuber = async () => {
    const vtubers = await getDocumentRequest(VTUBERS_ID);
    const variants = await getDocumentRequest(VARIANTS_ID);

    const cardLimit = vtubers.cards.length - 1;

    const drawedCard = Math.floor(Math.random() * cardLimit) + 1;
    const variant = variants.variants.find(x => x.id === 'white');

    return { card: vtubers.cards[drawedCard], variant };
}

export const handleDrawChoice = async (postUrl, patchUrl, member, pick) => {
    const { id } = member.user;

    if (pick.startsWith('retry')) {
        const nbrRetry = pick.split('/')[1];
        const { card, variant } = await drawVtuber();

        const formData = new FormData();
        const fileData = await generateImage(card, variant);
        const blob = new Blob([fileData], { type: 'image/png' });

        formData.append("payload_json", JSON.stringify({
            ...handleDrawJson(member.user.id, card, variant, nbrRetry - 1)
        }));

        formData.append(`file1`, blob, `${card.id}-${variant.id}.png`);

        await post(postUrl, { type: 7 })
        return await patchForm(patchUrl, formData);
    } else {
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

}

export const handleDraw = async (url, member, retry = 2) => {
    const { id } = member.user;
    const document = await getDocumentRequest(id);
    const canDraw = document.lastDrawTimestamp + HOUR_IN_MS < Date.now() || id === KYUUSEI_ID;

    if (canDraw) {
        await setDocumentRequest(id, { ...document, lastDrawTimestamp: Date.now() });

        const { card, variant } = await drawVtuber();
        const formData = new FormData();

        formData.append("payload_json", JSON.stringify({
            "type": 4,
            "data": {
                ...handleDrawJson(member.user.id, card, variant, 2)
            }
        }));

        const fileData = await generateImage(card, variant);
        const blob = new Blob([fileData], { type: 'image/png' });
        formData.append(`file1`, blob, `${card.id}-${variant.id}.png`);

        return await postForm(url, formData);
    } else {
        return await post(url, {
            "type": 4,
            "data": {
                "content": `Vous pourrez tirer une carte dans ${Math.floor((document.lastDrawTimestamp + HOUR_IN_MS - Date.now()) / 60000)} minutes.`,
            }
        });
    }
}

const handleDrawJson = (userId, card, variant, retry) => ({
    "content": `Commande: Tirer une carte, par <@${userId}>`,
    "components": [
        {
            "type": 1,
            "components": [{
                "type": 2,
                "style": 1,
                "label": `Sélectionner ${card.id}`,
                "custom_id": `${card.id}-${variant.id}`,
            }, {
                "type": 2,
                "style": 3,
                "label": `Réessayer (${retry} essai(s) restants)`,
                "custom_id": `retry/${retry}`,
                "disabled": retry === 0
            }]
        }
    ],
    "embeds": [{
        "title": "Résultat du tirage",
        "url": "http://localhost:3000",
        "description": `Vous avez tiré ${card.id}`,
        "image": { url: `attachment://${card.id}-${variant.id}.png` }
    }],
})