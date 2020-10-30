import React from "react";

import "./Style.css";

import Main from "./MainController";
// import RequestController from "./RequestController";

export default function App() {
  return (
    <Main
      mainBarClassName="MayWeatherBar"
      mainBarId={0}
      searchClassName="MayWeatherSearch"
      searchId={1}
      menuClassName="MayWeatherMenu"
      menuId={2}
    />
  );
}
