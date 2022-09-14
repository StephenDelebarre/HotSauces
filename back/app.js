const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config();

const app = express();

// connecte notre api a notre cluster mongoose

mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@cluster0.qhnossz.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());
app.use(cors()); 

// headers qui enmpêches les erreurs CORS

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use("/api/sauces", routes)
app.use("/api/auth", userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;