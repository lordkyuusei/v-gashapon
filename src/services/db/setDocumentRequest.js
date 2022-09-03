import { addOrSetDocument } from "./database.js"

const setDocumentRequest = async (id, document) => {
    await addOrSetDocument(id, document);
}

export default setDocumentRequest;