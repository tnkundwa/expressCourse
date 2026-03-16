import { getDBConnection } from "./db/db.js";

function logTable(){
    const db = getDBConnection();
    
    try {
        const hold = db.prepare(`SELECT * FROM cart_items`).all();
        console.log(hold);
    } catch (error) {
        console.log(`Something went wrong creating the table $error.message`);
    } finally {
        db.close();
    }
}

logTable();