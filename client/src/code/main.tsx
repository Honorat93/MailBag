import "normalize.css";
import "../css/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import BaseLayout from "./components/BaseLayout";

const rootElement = document.getElementById("mainContainer");

if (!rootElement) {
  throw new Error("L'élément avec l'ID 'mainContainer' est introuvable dans le DOM.");
}

const baseComponent = ReactDOM.createRoot(rootElement);

baseComponent.render(
  <React.StrictMode>
    <BaseLayout />
  </React.StrictMode>
);
