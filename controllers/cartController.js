import { getDBConnection } from '../db/db.js'

export function addToCart(req, res) {
 const db = getDBConnection();
 const userLoggedIn = req.session.userId;
 const productId = parseInt(req.body.productId, 10);
 if (isNaN(productId)) {
  return res.status(400).json({ error: 'Invalid product ID'})
 }
 const exstingItem = db.prepare(`SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`).get(userLoggedIn, productId);
 if (exstingItem){
    db.prepare(`UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ?`).run(productId);
 } else {
    db.prepare(`INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?,?,?)`).run(userLoggedIn, productId, 1);
 }
 res.json({ message: 'Added to cart' })
}

export function getCartCount(req, res) {
  const db = getDBConnection();

  const itemCount = db.prepare(`SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id = ?`).get(req.session.userId);

  res.json({ totalItems: itemCount.totalItems || 0 });

}

export function getAll(req, res) {
   
  const db = getDBConnection();

  const getAll = db.prepare(`SELECT ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price FROM cart_items ci 
   JOIN products p ON p.id = ci.product_id WHERE user_id = ?`).all(req.session.userId);

  res.json({ items: getAll})

} 

export function deleteItem(req, res) {

    const db = getDBConnection();
    const itemId = parseInt(req.params.itemId, 10)

    if (isNaN(itemId)) {
      return res.status(400).json({error: 'Invalid item ID'})
    }

    const item = db.prepare(`SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?`).get(itemId, req.session.userId);
    
    if (!item) {
       return res.status(400).json({error: 'Item not found'})
      }
      
    db.prepare(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`).run(itemId, req.session.userId);

    res.status(204).end();
   }

export function deleteAll(req, res) {

  const db = getDBConnection();

  db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(req.session.userId);
  
  res.status(204).end();
}

