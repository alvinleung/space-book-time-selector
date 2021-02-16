import React from "react";
import logo from "./SpaceBook.svg";
import "./TopBar.css";

export default function TopBar() {
  return (
    <div className="top-bar">
      <img src={logo} alt="logo" />
    </div>
  );
}
