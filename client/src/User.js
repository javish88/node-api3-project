import React, { useState, useEffect } from "react";
import axios from "axios";

function User(props) {
  const [posts, setPosts] = useState([]);
  const id = props.match.params.id;
  console.log(posts);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/${id}/posts`)
      .then(res => {
        setPosts(res.data);
        console.log("posts", res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div>
      <h1>User's Posts</h1>
      {posts.map(post => {
        return <p>{post.text}</p>;
      })}
    </div>
  );
}

export default User;
