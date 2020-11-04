const passwordValidator = require('password-validator');
 
// Création d'un schéma pour le mot de passe afin de renforcer la sécurité

const passwordSchema = new passwordValidator();
 
// Ajout des propriétés que le mot de passe doit respecter
passwordSchema
.is().min(8)                                    // Longueur minimale 8 caractères
.is().max(100)                                  // Longueur maximale 100 caractères
.has().uppercase()                              // Doit comporter des majuscules
.has().lowercase()                              // doit comporter des minuscules
.has().digits(2)                                // Doit avoir 2 chiffres
.has().not().spaces()                           // Ne doit pas comporter d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Ne doit pas être les mots inscrits
 
module.exports = passwordSchema;