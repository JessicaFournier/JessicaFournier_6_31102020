const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('cookie-session');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const path = require('path');


//Connection à la base de données

mongoose.connect('mongodb+srv://Jessica_Fournier:NETware2412@cluster0.rcbg2.mongodb.net/Piquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Création d'une application express

const app = express();

//middleware permettant d'accéder à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//middleware qui aide à sécuriser l'API en définissant divers en-têtes HTTP
app.use(helmet());

//middleware qui sécurise les cookies en http-only
app.use(session({
  name:'session',
  secret: 's3Cur3',
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000'
  }
}));

//middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.json());

//middleware qui permet de charger les fichiers qui sont dans le répertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware qui va transmettre les requêtes de ces url vers les routes correspondantes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;