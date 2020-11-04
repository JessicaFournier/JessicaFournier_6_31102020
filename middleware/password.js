const passwordSchema = require('../models/password');

//Vérifie que le mot de passe correspond au schéma donné pour s'assurer que le mot de passe de l'utilisateur soit fort
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ error : 'Le mot de passe n\'est pas assez fort : ' + passwordSchema.validate(req.body.password, { list: true }) });
    } else {
        next();
    }
}