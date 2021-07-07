const express = require("express");
const db = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  db.get(req.query)
    .catch(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "No posts found" });
      }
    })
    .then(err => {
      console.log(err);
      res.status(500).json({ message: "Error getting posts" });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  db.getById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the post" });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The threat has been eliminated sir" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error removing post" });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  db.update(req.params.id, req.body)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error updating the post" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  db.getById(req.params.id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "invalid post ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error validating post ID" });
    });
}

module.exports = router;
