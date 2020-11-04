const Sauce = require('../models/sauce');
const fs = require('fs');

//Création d'une sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //supprime l'id envoyé par le front
  delete sauceObject._id;
  //création d'une instance du modèle sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked:[],
    usersDisliked: []
  });
  //sauvegarde de la sauce dans la base de données
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//récupération d'une sauce par son id

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

//modification d'une sauce en fonction de la présence ou non d'un fichier

exports.modifySauce = (req, res, next) => {
  //on vérifie la présence d'un fichier
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  //on sauvegarde les modifications
  Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
    .then(
      () => {
        res.status(201).json({
          message: 'Sauce updated successfully!'
        });
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
    });
};

//suppression d'une sauce et du fichier image
exports.deleteSauce = (req, res, next) => {
  console.log(req.params.id);
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      console.log(req.params.id);
      const filename = sauce.imageUrl.split('/images/')[1];
      console.log(filename);
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Définit le statut "j'aime" d'une sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};