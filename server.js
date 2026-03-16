import express from 'express';
import { productRouter } from './routes/products.js';
import { authRouter } from './routes/auth.js';
import session from 'express-session';
import { meRouter } from './routes/me.js';
import { cartRouter } from './routes/cart.js';
const secret = process.env.SPIRAL_SESSION_SECRET;

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));
app.use(express.static('public'));
app.use('/api/products', productRouter);
app.use('/api/auth/me', meRouter)
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter)

app.listen(PORT, () => {
    console.log(`Starting on PORT ${PORT}`);
})