import { getDocument, addOrSetDocument } from "./database.js";

const generateNewDocument = (id) => ({
    id,
    points: 0,
    cards: [],
    lastDrawTimestamp: 0,
});

const getDocumentRequest = async (id) => {
    const document = await getDocument(id);

    if (document === undefined) {
        const newDocument = generateNewDocument(id);
        await addOrSetDocument(id, newDocument);
        return newDocument;
    }

    return document;
}

export default getDocumentRequest;