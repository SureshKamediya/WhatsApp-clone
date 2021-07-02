import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import instance from "../axios_instance";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirects, setRedirects] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    instance
      .post("/user/login", user, { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.data.message === "Success") setRedirects(true);
        else alert(response.data.message);
      });
    setEmail("");
    setPassword("");
  };

  if (redirects) {
    return <Redirect to="/app"></Redirect>;
  }

  return (
    <div className="login mx-auto">
      <div className="form-signin">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label for="floatingPassword">Password</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
      <div className="login_signUp text-center">
        <Link to="/register">Not A Member Sign Up Now?</Link>
      </div>
    </div>
  );
}

export default Login;
