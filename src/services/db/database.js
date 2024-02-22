import { Level } from "level";
import { DATABASE_URL, VTUBERS_ID, VARIANTS_ID } from "../../lib/constants.js";

let db;

const feedDatabase = async () => {
    const data = {
        id: VTUBERS_ID,
        cards: [
            { id: "Araesha" },
            { id: "Fumiko" },
            { id: "Hiwamari" },
            { id: "Spicalyce" },
            { id: "Pawa-Chan" },
            { id: "Hana-Chan" },
            { id: "Yuki" }
        ]
    }

    const variants = {
        id: VARIANTS_ID,
        variants: [
            { id: "black" },
            { id: "blue" },
            { id: "brown" },
            { id: "gold" },
            { id: "green" },
            { id: "mauve" },
            { id: "orange" },
            { id: "pink" },
            { id: "purple" },
            { id: "red" },
            { id: "teal" },
            { id: "white" },
            { id: "yellow" },
        ]
    }

    await db.put(VTUBERS_ID, data);
    await db.put(VARIANTS_ID, variants);
}

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
    db.open(async () => {
        const isEmpty = [...await db.keys({ limit: 1 }).all()].length === 0;
        if (isEmpty) {
            await feedDatabase();
        }
    });
}

export const closeDatabase = () => {
    db.close();
}