import React from "react";
import "../css/NavbarHome.css";
import Image1 from "../assets/images/logounj.png";
import Image2 from "../assets/images/logosmk7.png";
import Art1 from "../assets/images/art1.svg";
import Art2 from "../assets/images/art2.svg";

function NavbarHome() {
  return (
    <header className="navbar-home">
      <img src={Art1} alt="Art 1" className="art art-left" />
      <div className="navbar-logos">
        <img src={Image1} alt="Logo UNJ" />
        <img src={Image2} alt="Logo SMK 7" />
      </div>
      <img src={Art2} alt="Art 2" className="art art-right" />
    </header>
  );
}

export default NavbarHome;
