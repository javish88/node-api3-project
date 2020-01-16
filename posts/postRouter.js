const express = require('express');
const db = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  db.get(req.query)
  .catch(posts => {
    if (posts) {
      res.status(200).json(posts)
    } else {
      res.status(404).json({message: "No posts found here amigo"})
    }
  })
  .then(err => {
    console.log(err)
    res.status(500).json({message: "Error getting posts"})
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  db.getById(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "Error retrieving post"})
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  db.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({message: "DELETE DELETE DELETE DELETE"})
    } else {
      res.status(404).json({message: "The post can not be found"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: "Error deleting the post"})
  })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  db.update(req.params.id, req.body)
  .then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: "The post could not be found"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: "Error updating the post"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  db.getById(req.params.id)
  .then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({message: "invalide post ID"})
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "Error validating post ID"})
  })
}

module.exports = router;
