import React, { useEffect } from "react";
import Carousel from "../components/LandingComponent/Carousel";
import AllCategory from "../components/LandingComponent/AllCategory";
import PromoCode from "../components/LandingComponent/PromoCode";
import LandingProduct from "../components/LandingComponent/LandingProduct";

const Landing = (props) => {
  //SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

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
