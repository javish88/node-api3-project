const express = require('express');
const userDB = require('./userDb.js');
const postsDB = require('../posts/postDb');

const router = express.Router();

//GETS
router.get('/', (req, res) => {
  userDB.get()
  .then(users => {
    res
    .status(200)
    .json({users})
  })
  .catch(error => {
    res
    .status(500)
    .json({ message: "The user list could not be retrieved from the database", error})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id
  
  userDB.getById(id)
  .then(user => {
    res
    .status(200)
    .json(user)
  })
  .catch(error => {
    res
    .status(500)
    .json({ message: "The server could not retrieve the User from the database", error})
  })
});

//Get for posts subroute
router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id  

  userDB.getUserPosts(id)
   .then(posts => {
    res
    .status(200)
    .json(posts)
  })
  .catch(error => {
    res
    .status(500)
    .json({ message: "The server could not retrieve the User's posts from the database", error})
  })  
});

//Posts
router.post('/', validateUser, (req, res) => {
  userDB.insert(req.body)
    .then(user => {
      res
        .status(201)
        .json(user)
    })
    .catch(error => {
      res
      .status(500)
      .json({ message: "There was an error while saving the user to the database", error})
  })
});

//Post for posts subroute
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  
  postsDB.insert(req.body)
    .then(post => {
      res
        .status(201)
        .json(post)
    })
    .catch(error => {
      res
      .status(500)
      .json({ message: "There was an error while saving the post to the database", error})
    })
});


//PUT
router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id
  
  userDB.update(id, req.body)
  .then(userUpdate => {
    userDB.getById(id)
        .then(user => {
          if (userUpdate === 1){ 
            res
              .status(200)
              .json(user)
          } else {
            res
              .status(406)
              .json({ message: "The server returned an incorrect response."})
            }
          })
          .catch(error => {
            res
              .status(500)
              .json({ message: "There was an error while modifying the user in the database", error})
          })
    })
});

//DELETE
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id

  userDB.getById(id)
    .then(user => {
        userDB.remove(id)
            .then(removedUser => {
               if(removedUser === 1){ 
                res
                .status(200)
                .json({message: `The user with ID number ${id} has been successfully removed.`, user})
               } else {
                 res
                 .status(406)
                 .json({ message: "The server returned an incorrect response."})
               }
            })
            .catch(error => {
                res
                .status(500)
                .json({ message: "The server could not successfully delete the user.", error})
            })
    });
});


//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  console.log(id);
  userDB.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res
        .status(400)
        .json({error: 'Invalid user ID.'});
      }
    })
    .catch(error => {
      console.log(error);
      res
      .status(500)
      .json({error: 'Server error validating user ID'});
    })
} 

function validateUser(req, res, next) {
  
  if (Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ message: "Missing user data." });
  } else if (!req.body.name){
    res
      .status(400)
      .json({ message: "Missing required name field." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ message: "Missing post data." });
  } else if (!req.body.text){
    res
      .status(400)
      .json({ message: "Missing required text field." });
  } else {
    next();
  }
}

module.exports = router;