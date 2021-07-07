const express = require("express");
const db = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error adding the user" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  postDb
    .insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error adding post" });
    });
});

router.get("/", (req, res) => {
  db.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ errorMessage: "User not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "No posts found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ messae: "Error getting the posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The threat has been elimated sir" });
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error removing the user" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  db.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error updating the user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
      } else {
        res.status(404).json({ message: "invalid user ID" });
      }
      next();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error validating user ID" });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  }
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing post data" });
  }
  if (!req.body.text) {
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
