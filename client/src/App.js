import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserList from "./UserList";
import User from "./User";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" render={props => <UserList {...props} />} />
        <Route path="/users/:id" render={props => <User {...props} />} />
      </div>
    </Router>
  );
}

export default App;
