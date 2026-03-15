import { vinyl } from './data.js'
import { getDBConnection } from "./db/db.js";

function seedPath(){

    const db = getDBConnection();
    const insert = db.prepare(`INSERT INTO products (title, artist, price, image, year, genre, stock) values (?, ?, ?, ?, ?, ?, ?)`);
    const insertMany = db.transaction((data) => {
        for (const item of data){
            insert.run(item.title, item.artist, item.price, item.image, item.year, item.genre, item.stock);
        }
    });

    try {
        insertMany(vinyl);
        console.log('All records inserted successfully');
    } catch (error) {
        console.error('Transaction failed, no data was saved:', error.message);
    } finally {
        db.close();
    }
}

seedPath();