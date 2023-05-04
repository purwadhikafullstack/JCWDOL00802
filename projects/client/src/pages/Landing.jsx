import React, { useState, useEffect } from "react";
import { Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../helper";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Landing = (props) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [dataCategory, setDataCategory] = useState(null);
  const [dataPromo, setDataPromo] = useState(null);

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

  const getCategory = async () => {
    try {
      let category = await Axios.post(API_URL + `/apis/product/categorylist`, {
        page: parseInt(page) - 1,
        limit: 5,
        search: "",
        order: 0,
      });
      setDataCategory(category.data.data);
      setLastPage(category.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };
  const getPromo = async () => {
    try {
      let promo = await Axios.get(API_URL + `/apis/promo/getpromo`);
      setDataPromo(promo.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  let dataExist = false;
  if (dataCategory == null) {
    dataExist = false;
  } else {
    dataExist = true;
  }

  useEffect(() => {
    getCategory();
  }, [page]);

  useEffect(() => {
    getPromo();
  }, []);

  const printDataCategory = () => {
    let data = dataExist ? dataCategory : [];

    return data.map((val, idx) => {
      return (
        <Link
          className="card bg-white m-2 p-3 shadow d-flex "
          activeclassName="active"
          boxSize="150px"
          style={{
            width: "200px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={`${API_URL}/img/category/${val.category_picture}`}
            alt={val.category}
            borderRadius="md"
            boxSize="100px"
            objectFit="cover"
          />
          <div className="link_text my-1">{val.category}</div>
        </Link>
      );
    });
  };

  let previous = () => {
    if (page == 1) {
      setPage(lastPage);
    } else {
      setPage(page - 1);
    }
  };

  let next = () => {
    if (page == lastPage) {
      setPage(1);
    } else {
      setPage(page + 1);
    }
  };

  return (
    <div className="bg-white w-100 p-2 m-auto shadow">
      {/* Component Carousel */}
      <div>
        <div id="banner">
          <div
            id="carouselExampleIndicators"
            className="carousel slide m-5 shadow "
          >
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img
                  src={
                    dataPromo
                      ? `${API_URL}/img/promo/${dataPromo[0].promo_picture}`
                      : require("../Assets/hitam.jpg")
                  }
                  class="d-block w-100"
                  alt="1"
                />
              </div>
              <div class="carousel-item">
                <img
                  src={
                    dataPromo
                      ? `${API_URL}/img/promo/${dataPromo[1].promo_picture}`
                      : require("../Assets/hitam.jpg")
                  }
                  class="d-block w-100"
                  alt="2"
                />
              </div>
              <div class="carousel-item">
                <img
                  src={
                    dataPromo
                      ? `${API_URL}/img/promo/${dataPromo[2].promo_picture}`
                      : require("../Assets/hitam.jpg")
                  }
                  class="d-block w-100"
                  alt="3"
                />
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div
          id="carouselExampleIndicators"
          className="carousel slide m-5 shadow "
        >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
        </div>
      </div>
      {/* ComponentCategory */}
      <div>
        <Text fontSize="2xl" color="#f96c08">
          Kategori
        </Text>
      </div>
      <br />
      {/* CARD CATEGORY */}
      <div
        className="d-flex flex-row card shadow m-auto p-2"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div
          className="d-flex col-1 landingpgg"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <FaChevronLeft onClick={() => previous()} />
        </div>
        <div
          className="d-flex col-10"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {printDataCategory()}
        </div>
        <div
          className="d-flex col-1 landingpgg"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <FaChevronRight onClick={() => next()} />
        </div>
      </div>
    </div>
  );
};
export default Landing;
