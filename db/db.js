import Database from "better-sqlite3";
import path from 'node:path';

export function getDBConnection(){

    const dbPath = path.join('database.db');

    const db = new Database(dbPath, {
        verbose: console.log
    })

    return db;
}