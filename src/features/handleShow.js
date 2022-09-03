import { post } from "../lib/fetch.js";
import getDocumentRequest from "../services/db/getDocumentRequest.js";

const showCard = async (id, cardId) => {
    const document = await getDocumentRequest(id);
    const card = document.cards.find(card => card.id === cardId);
    return card ? { card: card.id } : { card: "Vous ne possédez pas cette carte." };
}

const showCards = async (id) => {
    const document = await getDocumentRequest(id);
    return { points: document.points, cards: document.cards.map(card => card.id) };
}

const handleShow = async (url, member, { options }) => {
    const { name, options: params } = options[0];
    const { id } = member.user;

    const { points, cards, card } = name === 'all' ? await showCards(id) : await showCard(id, params[0].value);

    const content = name === 'all' ?
        `Commande: Toutes les cartes de <@${member.user.id}>: ${cards.join(', ')}, pour un total de ${points} points.` :
        `Commande: Afficher une carte (code: ${params[0].value}), par <@${member.user.id}> : ${card}`;

    return await post(url, {
        "type": 4,
        "data": {
            content
        }
    });
}

export default handleShow;