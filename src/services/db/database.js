import { Level } from "level";
import { DATABASE_URL } from "../../lib/constants.js";

let db;

export const logDatabase = async (when) => {
    for await (const [key, value] of db.iterator()) {
        console.log(when, typeof key, key, '=>', value)
    }
}

export const getDocument = async (id) => {
    try {
        const document = await db.get(id);
        return document;
    } catch (err) {
        console.error(err);
    }
}

export const addOrSetDocument = async (id, document) => {
    await db.put(id, document);
}

export const openDatabase = () => {
    db = new Level(DATABASE_URL, { valueEncoding: 'json' });
    db.open(() => { });
}

export const closeDatabase = () => {
    db.close();
}