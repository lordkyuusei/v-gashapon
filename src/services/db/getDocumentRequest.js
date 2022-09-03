import { getDocument, addOrSetDocument, logDatabase } from "./database.js";

const getDocumentRequest = async (id) => {
    const document = await getDocument(id);

    console.log('[getDocumentRequest] document', document);

    if (document === undefined) {
        const newDocument = { id, cards: [] };
        console.log('[addDocumentRequest] document', newDocument);
        await addOrSetDocument(id, newDocument);
        return newDocument;
    }

    return document;
}

export default getDocumentRequest;