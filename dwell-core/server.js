require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const { setLocals } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dwellcore_secret_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

// Flash
app.use(flash());

// Set locals middleware
app.use(setLocals);

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/user'));

// Home redirect
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <html>
    <head><title>404 - Dwell Core</title>
    <style>
      body{font-family:Inter,sans-serif;background:#1A1A2E;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:16px;}
      h1{font-size:72px;margin:0;background:linear-gradient(135deg,#6C63FF,#FF6584);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
      p{color:#888;font-size:16px;}
      a{color:#6C63FF;text-decoration:none;font-weight:600;padding:10px 24px;border:2px solid #6C63FF;border-radius:10px;}
    </style>
    </head>
    <body>
      <h1>404</h1>
      <p>Oops! This page doesn't exist in Dwell Core.</p>
      <a href="/">← Go Home</a>
    </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! Please try again.');
});

app.listen(PORT, () => {
  console.log(`\n🏢 Dwell Core is running!`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
