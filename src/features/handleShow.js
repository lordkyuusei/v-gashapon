import { post } from "../lib/fetch.js";
import getDocumentRequest from "../services/db/getDocumentRequest.js";

const showCard = (cardId) => {
    return cardId;
}

const showCards = async (id) => {
    const document = await getDocumentRequest(id);
    return document.cards.map(card => card.id);
}

const handleShow = async (url, member, { options }) => {
    const { name, options: params } = options[0];

    const output = name === 'all' ? await showCards(member.user.id) : showCard(params[0].value);

    const content = name === 'all' ?
        `Commande: Toutes les cartes de <@${member.user.id}>: ${output.join(', ')}` :
        `Commande: Afficher une carte (code: ${params[0].value}), par <@${member.user.id}>`;

    if (name === 'all') {
        return await post(url, {
            "type": 4,
            "data": {
                content
            }
        });
    }
}

export default handleShow;