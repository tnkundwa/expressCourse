import { getDBConnection } from "../db/db.js"

export function getGenres(req, res){

    const db = getDBConnection();

  console.log('--- getGenres function triggered ---');

  try {
    console.log('--- DB Connected ---');
    const genreRows = db.prepare(`SELECT DISTINCT genre from products`).all();
    const genres = genreRows.map(row => row.genre);
    res.json(genres);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch genres', details: err.message})
  }

}

export function getProducts(req, res){

    console.log('Incoming Query Params:', req.query);
    const db = getDBConnection();

  try {
    let query = `SELECT * FROM products`;

    const {genre, search} = req.query;
    let products;

    if(genre){
      query += ` WHERE genre = ?`;
      products = db.prepare(query).all(genre);
    } else if (search){
      query += ` WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?`
      const searchTerm = `%${search}%`;
      products = db.prepare(query).all(searchTerm, searchTerm, searchTerm);
    } else {
      products = db.prepare(query).all();
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch products', details: err.message})
  }
}