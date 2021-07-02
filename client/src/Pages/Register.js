import React, { useState } from "react";
import { Redirect } from "react-router";
import instance from "../axios_instance";
import "./Login.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [redirects, setRedirects] = useState(false);

  const onChangeFile = (e) => {
    setFileName(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("user_image", fileName);

    await instance.post("/user/signUp", formData).then((response) => {
      console.log(response);
      if (response.data.message === "Success") {
        alert("You are registered");
        setRedirects(!redirects);
      }
    });
    setName("");
    setEmail("");
    setPassword("");
    setFileName("");
  };

  if (redirects) {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className="register mx-auto">
      <div className="form-signin">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h1 className="h3 mb-3 fw-normal">Register Here</h1>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-group">
            <label htmlFor="">Choose User Image</label>
            <input
              type="file"
              className="form-control-file"
              filename="user_image"
              accept="image/*"
              onChange={onChangeFile}
            />
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
