import React, { useState } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";

const AuthPage = () => {
  const [screen, setScreen] = useState("Login");

  const toggleScreen = () => {
    setScreen(screen === "Login" ? "Signup" : "Login");
  };
  console.log(screen);
  return (
    <>
      {screen === "Login" ? (
        <Login toggleScreen={toggleScreen} />
      ) : (
        <Signup toggleScreen={toggleScreen} />
      )}
    </>
  );
};

export default AuthPage;
