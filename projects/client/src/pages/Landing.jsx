import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

import Axios from "axios";
import { API_URL } from "../helper";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/LandingComponent/Carousel";
import AllCategory from "../components/LandingComponent/AllCategory";
import PromoCode from "../components/LandingComponent/PromoCode";
import LandingProduct from "../components/LandingComponent/LandingProduct";

const Landing = (props) => {
  const navigate = useNavigate();

  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  let getLocalStorage = localStorage.getItem("cnc_login");

  useEffect(() => {
    if (role == 2 || role == 3) {
      navigate("/admin");
    }
  }, [getLocalStorage]);

  return (
    <div>
      <Carousel />
      <div className="categorybar">
        <AllCategory />
      </div>
      <div className="promobar">
        <PromoCode />
      </div>
      <div
        className="d-flex"
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LandingProduct />
      </div>
    </div>
  );
};
export default Landing;
