import { handleDraw, handleDrawChoice } from '../../features/handleDraw.js';
import handleBurn from '../../features/handleBurn.js';
import handleShow from '../../features/handleShow.js';

import { log } from '../../lib/log.js'
import gatewayStore from '../../lib/store.js';

import { INTERACTION_URL, WEBHOOK_URL } from '../../lib/constants.js';

const handleInteractionCreate = async (_, interaction) => {
    const { type, token, id, member, data } = interaction;
    const url = `${INTERACTION_URL}/${id}/${token}/callback`;

    log('yellow', "[event] INTERACTION_CREATE", member.user.username, type, data.options);

    if (data.options) {
        gatewayStore.initial_interaction_token = token;
        const { name } = data.options[0];

        const mapOptionToMethods = [
            { option: name === 'draw', method: async () => await handleDraw(url, member) },
            { option: name === 'burn', method: async () => await handleBurn(url, member, data.options[0]) },
            { option: name === 'show', method: async () => await handleShow(url, member, data.options[0]) },
            { option: true, method: () => console.log('\x1b[31m%s\x1b[0m', '[unknown]', type) },
        ];

        const handle = mapOptionToMethods.find(option => option.option === true).method;
        return handle();
    } else {
        const { custom_id } = data;
        const patchUrl = `${WEBHOOK_URL}${gatewayStore.initial_interaction_token || token}/messages/@original`;
        return await handleDrawChoice(url, patchUrl, member, custom_id);
    }
}

const handleReady = (data) => {
    const { session_id, resume_gateway_url } = data;

    gatewayStore.session_id = session_id;
    gatewayStore.resume_gateway_url = resume_gateway_url;

    log('yellow', "[event] READY", resume_gateway_url);
}

const handleMessageCreate = (data) => {
    const { content, author } = data;
    log('yellow', "[event] MESSAGE_CREATE", author.username, ' - ', content.length ? content : '[REDACTED]');
}

export const handleEvent = async (ws, t, d) => {
    const mapEventToMethods = [
        { event: t === 'READY', method: () => handleReady(d) },
        { event: t === 'MESSAGE_CREATE', method: () => handleMessageCreate(d) },
        { event: t === 'INTERACTION_CREATE', method: async () => await handleInteractionCreate(ws, d) },
        { event: true, method: () => log('red', "[event]", t, "not handled.") },
    ]

    const handle = mapEventToMethods.find(event => event.event === true).method;
    handle();
}