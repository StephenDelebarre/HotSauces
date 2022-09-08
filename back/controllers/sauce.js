const Sauces = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    delete sauce._id;
    const Sauce = new Sauces({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    Sauce.save()
    .then(() => res.status(201).json({ message: "Objet enregistré"}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauce = req.file ? {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};

    delete sauce._userId;

    Sauces.findOne({_id: req.params.id})
        .then((Sauce) => {
            if (Sauce.userId != req.body.userId) {
                res.status(401).json({ message: 'Non autorisé'});
            } else {
            Sauces.updateOne({ _id: req.params.id}, {...sauce, _id: req.params.id})
                .then(() => res.status(200).json({ message: "Objet modifié"}))
                .catch(error => res.status(401).json({error}));
            };
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
      .then(sauces => {
        if (sauces.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non autorisé'});
        } else {
          const filename = sauces.imageUrl.split('/images/')[1];
          fs.unlink(`image/${filename}`, () => {
            Sauces.deleteOne({_id: req.params.id})
              .then(() => res.status(200).json({ message: "Objet modifié"}))
              .catch(error => res.status(401).json({error}));
          })
        };
      })
      .catch(error => res.status(500).json({error}));
  };
  
  exports.getOneSauce = (req, res, next) => { 
    Sauces.findOne({ _id: req.params.id}) 
      .then(Sauces => res.status(200).json(Sauces))
      .catch(error => res.status(404).json({error}));
  };
  
    exports.getAllSauces = (req, res, next) => {
    Sauces.find()
      .then(Sauces => res.status(200).json(Sauces))
      .catch(error => res.status(400).json({error}));
  };

  exports.likeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
                if(req.body.like == 1) { 
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes += req.body.like;
                } else if(req.body.like == -1) { 
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes -= req.body.like;
                };
            };
            if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
                sauce.usersLiked.splice(likesUserIndex, 1);
                sauce.likes -= 1;
            };
            if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
                sauce.usersDisliked.splice(likesUserIndex, 1);
                sauce.dislikes -= 1;
            }
            sauce.save();
            res.status(201).json({ message: 'Like / Dislike mis à jour' });
        })
        .catch(error => res.status(500).json({ error }));
};