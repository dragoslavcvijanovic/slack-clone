import { Button } from "@material-ui/core";
import React from "react";
import "./Login.css";
import { provider, auth } from "../firebase";
import { useStateValue } from "./StateProvider";
import { ActionTypes } from "./reducer";
import { actionTypes } from "./reducer";

function Login() {
  const [state, dispatch] = useStateValue();

  const signIn = (e) => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result);
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg"
          alt=""
        />
        <h1> Sign in </h1>
        <Button onClick={signIn}>Sign in with Google </Button>
      </div>
    </div>
  );
}

export default Login;
