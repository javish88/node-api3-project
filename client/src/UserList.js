import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/users")
      .then(res => {
        setUsers(res.data);
        console.log("res", res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Lord of the Rings Fan Club</h1>
      {users.map(user => (
        <div>
          <Link to={`/users/${user.id}`}>
            <button>{user.name}</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default UserList;
