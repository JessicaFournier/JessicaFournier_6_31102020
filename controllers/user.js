const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');

//définit comment l'adresse mail doit être masquée
const maskEmail2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
}

//sauvegarde un nouvel utilisateur, masque l'email et hash le mot de passe

exports.signup = (req, res, next) => {
    // hachage du mot de passe, salage par 10
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User( 
            {
                email: req.body.email,
                emailMasked: MaskData.maskEmail2(req.body.email, maskEmail2Options),
                password: hash
            });
            // sauvegarde de l'utilisateur
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


//vérifie si l'utilisateur existe, si oui, on vérifie le mot de passe. Si celui ci est correct, on renvoie un tokenn contenant l'ID de l'utilisateur
//sinon on renvoie une erreur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                      { userId: user._id },
                      'RANDOM_TOKEN_SECRET',
                      { expiresIn: '24h' }
                    )
                });
            })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};  