import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles.css";

import { Login } from "./Login";
import { Menu } from "./Menu";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  return isAuth
    ? <Menu />
    : <Login onLoginSuccess={() => setIsAuth(true)} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);