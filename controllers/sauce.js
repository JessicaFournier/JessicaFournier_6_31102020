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
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //on récupère le nom du filename
      const filename = sauce.imageUrl.split('/images/')[1]; 
      //on supprime le fichier du dossier images
      fs.unlink(`images/${filename}`, () => {
        //on supprime la sauce de la base de données
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
      const userId = req.body.userId; 
      const like = req.body.like;
      //si l'utilisateur clique sur j'aime
      if (like == 1) { 
        // on vérifie que l'utilisateur n'a pas déjà cliqué sur j'aime
        if (sauce.usersLiked.indexOf(userId) !== 1) { 
          sauce.likes += 1;
          sauce.usersLiked.push(userId);
        }
        //on met à jour l'objet Sauce
        Sauce.updateOne({_id:req.params.id}, sauce)
        .then(sauce => {
          res.status(200).json(sauce);
        })
        .catch(
          (error) => {
            res.status(500).json({
              error: error
            });
        })
      //si l'utilisateur clique sur je n'aime pas
      } else if (like == -1) { 
        //on vérifie que l'utilisateur n'a pas déjà cliqué sur je n'aime pas
        if (sauce.usersDisliked.indexOf(userId) !== 1) { 
          sauce.dislikes += 1;
          sauce.usersDisliked.push(userId);
        }
        //on met à jour l'objet Sauce
        Sauce.updateOne({_id:req.params.id}, sauce)
        .then(sauce => {
          res.status(200).json(sauce);
        })
        .catch(
          (error) => {
            res.status(500).json({
              error: error
            });
        })
      //si l'utilisateur veut annuler son "j'aime" ou "je n'aime pas"
      } else if (like == 0) { 
        // on vérifie si l'utilisateur se trouve dans le tableau des usersLiked
        if (sauce.usersLiked.indexOf(userId) !== -1) { 
          // on retire -1 du décompte de "j'aime"
          sauce.likes -= 1; 
          // on retire l'userId du tableau de usersLiked
          sauce.usersLiked.splice(userId, 1); 
        // si l'utilisateur ne se trouve pas dans le tableau des usersLiked
        } else { 
          //on retire -1 du décompte de "je n'aime pas"
          sauce.dislikes -= 1; 
          // on retire l'userId du tableau de usersDisliked
          sauce.usersDisliked.splice(userId, 1); 
        }
        // on met à jour notre objet sauce
        Sauce.updateOne({_id:req.params.id}, sauce)
        .then(sauce => {
          res.status(200).json(sauce);
        })
        .catch(
          (error) => {
            res.status(500).json({
              error: error
            });
        })
      }
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};