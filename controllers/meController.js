import { getDBConnection } from '../db/db.js'

export function getCurrentUser(req, res) {
  try {
    const db = getDBConnection();

    if(!req.session.userId){
        return res.json({ isLoggedIn: false });
    }
    const user = db.prepare(`SELECT name FROM users WHERE id = ?`).get(req.session.userId);
    res.json({ isLoggedIn: true, name: user.name });

  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
} 