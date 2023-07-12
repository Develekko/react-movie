import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "animate.css/animate.min.css";
import "./index.css";
import "./media_index.css";
import ApiDataProvider from "./Context/ApiStore";
import AuthContextProvider from "./Context/AuthContext";
import ListContextProvider from "./Context/ListContext";
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'

$(window).blur(function() {
  document.title = 'We Miss You ❤️';
})

$(window).focus(function() {
  document.title = 'D Movies';
})
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <AuthContextProvider>
    <ApiDataProvider>
      <ListContextProvider>
        <App />
      </ListContextProvider>
    </ApiDataProvider>
  </AuthContextProvider>
);
