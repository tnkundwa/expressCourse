import { getDBConnection } from "./db/db.js";

function createTable(){
    const db = getDBConnection();

    db.exec(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    )

    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,  
            artist TEXT NOT NULL, 
            price REAL NOT NULL,
            image TEXT NOT NULL, 
            year INTEGER,
            genre TEXT,
            stock INTEGER
        )
    `);

    db.close();
}

createTable();