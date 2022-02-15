import React, { useState } from "react";
import PropTypes from "prop-types";

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = (event) => {
    event.preventDefault();
    login({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={logInUser}>
        <table>
          <tbody>
            <tr>
              <th> Username: </th>
              <td>
                <input
                  id="username"
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </td>
            </tr>
            <tr>
              <th> Password: </th>
              <td>
                <input
                  id="password"
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button id="login-button" type="submit">
                  Login
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
