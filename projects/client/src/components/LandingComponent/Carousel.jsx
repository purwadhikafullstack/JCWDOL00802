import { useEffect, useState } from "react";
import Axios from "axios";
import { API_URL } from "../../helper";

function Carousel() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const getPromo = async () => {
    try {
      let promo = await Axios.get(API_URL + `/apis/promo/getpromo`);
      setFirst(promo.data.data[0].promo_picture);
      setSecond(promo.data.data[1].promo_picture);
      setThird(promo.data.data[2].promo_picture);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromo();
  }, []);

  return (
    <div>
      <div
        id="carouselMain"
        className="carousel slide "
        data-bs-ride="carousel"
      >
        {/* TUNJUKIN GAMBAR KE BRP */}
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselMain"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselMain"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselMain"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        {/* GAMBAR */}
        <div class="carousel-inner">
          <div class="carousel-item active caro-item">
            <img
              src={
                first
                  ? `${API_URL}/img/promo/${first}`
                  : require("../../Assets/newuser.jpg")
              }
              class="d-block w-100 caro-img"
              alt="1"
            />
          </div>
          <div class="carousel-item caro-item">
            <img
              src={
                second
                  ? `${API_URL}/img/promo/${second}`
                  : require("../../Assets/parfum.jpg")
              }
              class="d-block w-100 caro-img"
              alt="2"
            />
          </div>
          <div class="carousel-item caro-item">
            <img
              src={
                third
                  ? `${API_URL}/img/promo/${third}`
                  : require("../../Assets/cantik.jpg")
              }
              class="d-block w-100 caro-img"
              alt="3"
            />
          </div>
        </div>
        {/* TOMBOL */}
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselMain"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselMain"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
export default Carousel;
