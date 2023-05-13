import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";

const Footer = () => {
  return (
    <div className="p-5 shadow-lg w-100 position-absolute top-100 bg-light">
      <div className="container d-none d-md-flex flex-wrap justify-content-between">
        <ul style={{ listStyleType: "none" }} className="d-none d-md-block">
          <li>
            <b>Click N Collect</b>
          </li>
          <li>Tentang Kami</li>
          <li>Mitra</li>
        </ul>
        <ul style={{ listStyleType: "none" }} className="d-none d-md-block">
          <li>
            <a href="/transaction">Transaksi</a>
          </li>
          <li>
            <a href="/product">Belanja Sekarang</a>
          </li>
          <li>Lokasi Kami</li>
        </ul>
        <div className="d-none d-md-block">
          <b>Ikuti Kami</b>
          <div className="d-flex">
            <a href="https://www.facebook.com/clickncollect23/">
              <AiFillFacebook size={42} color="#f96c08" />
            </a>
            <a href="https://www.instagram.com/">
              <AiFillInstagram size={42} color="#f96c08" />
            </a>
            <a href="https://www.twitter.com/">
              <AiFillTwitterCircle size={42} color="#f96c08" />
            </a>
          </div>
        </div>
        <span className="navbar-brand btn">
          <img
            src={require("../Assets/logoonly.png")}
            alt="Click N Collect"
            style={{ height: 200, objectFit: "scale-down" }}
          />
          <span className="fw-bold " style={{ color: "#f96c08" }}>
            Click N Collect
          </span>
        </span>
      </div>
      {/* For Mobile */}
      <div className="d-block d-md-none text-center">
        <span className="navbar-brand btn">
          <span className="fw-bold " style={{ color: "#f96c08" }}>
            Click N Collect
          </span>
        </span>
      </div>
      <div className="text-muted text-center">© 2023 ClickNCollect.</div>
    </div>
  );
};

export default Footer;
