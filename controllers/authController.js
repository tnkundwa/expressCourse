import validator from 'validator';
import { getDBConnection } from '../db/db.js';
import bcrypt from 'bcryptjs';

export async function registerUser(req, res) {

  const db = getDBConnection();

  let { name, email, username, password } = req.body;

  if ( !name || !email || !username || !password ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  name = name.trim()
  email = email.trim()
  username = username.trim()

  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 1–20 characters, using letters, numbers, _ or -.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {

    const hold = db.prepare(`SELECT username, email FROM users WHERE email = ? OR username = ?`).all(email, username);

    if(hold.length !== 0){
        return res.status(400).json({ error: 'Email or username already in use.' });
    }

    password = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`INSERT INTO users (name, email, username, password) values (?,?,?,?)`);
    
    const result = stmt.run(name, email, username, password); 

    console.log(result);

    req.session.userId = result.lastInsertRowid;

    res.status(201).json({ message: 'User registered'});

  } catch (err) {

    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' })

  }
}

export async function loginUser(req, res){

  const db = getDBConnection();

  let { username, password } = req.body;

  if ( !username || !password ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  username = username.trim();

  try {
    const userAvailable = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
  
    const valid = await bcrypt.compare(password, userAvailable.password);
  
    if(!userAvailable || !valid){
      return res.status(401).json({ error: 'Invalid credentials'});
    }
  
    req.session.userId = userAvailable.id;
    res.json( { message: 'Logged in' })
    
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

export function logoutUser(req, res){
    req.session.destroy(
      res.json({ message: 'Logged out' })
    )
}