import { useEffect, useState } from "react";
import Axios from "axios";
import { API_URL } from "../../helper";
import { Link, useNavigate } from "react-router-dom";
import { Card, Image, Text } from "@chakra-ui/react";

function AllCategory() {
  const [page, setPage] = useState(1);
  const [slide, setSlide] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [dataCategoryFirst, setDataCategoryFirst] = useState([]);
  const [dataCategorySecond, setDataCategorySecond] = useState([]);
  const [dataCategoryThird, setDataCategoryThird] = useState([]);
  let navigate = useNavigate();

  const getCategory = async (type, halaman) => {
    try {
      let category = await Axios.post(API_URL + `/apis/product/categorylist`, {
        page: parseInt(halaman) - 1,
        limit: 5,
        search: "",
        order: 0,
      });
      setLastPage(category.data.total_page);
      if (type == 1) {
        setDataCategoryFirst(category.data.data);
      } else if (type == 2) {
        setDataCategorySecond(category.data.data);
      } else if (type == 3) {
        setDataCategoryThird(category.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuItemClick = (categoryId) => {
    navigate("/product", { state: { id_category: categoryId } });
  };

  useEffect(() => {
    getCategory(1, 1);
  }, []);

  let previous = () => {
    let temp = page;
    if (page == 1) {
      temp = lastPage;
      setPage(temp);
    } else {
      temp = temp - 1;
      setPage(temp);
    }
    if (slide == 1) {
      getCategory(3, temp);
      setSlide(3);
    } else if (slide == 2) {
      getCategory(1, temp);
      setSlide(1);
    } else if (slide == 3) {
      getCategory(2, temp);
      setSlide(2);
    }
  };

  let next = () => {
    let temp = page;
    if (page == lastPage) {
      temp = 1;
      setPage(temp);
    } else {
      temp = temp + 1;
      setPage(temp);
    }
    if (slide == 1) {
      getCategory(2, temp);
      setSlide(2);
    } else if (slide == 2) {
      getCategory(3, temp);
      setSlide(3);
    } else if (slide == 3) {
      getCategory(1, temp);
      setSlide(1);
    }
  };

  const printDataCategoryFirst = () => {
    let data = dataCategoryFirst ? dataCategoryFirst : [];

    return data.map((val, idx) => {
      return (
        <Card
          className="card bg-white p-3 m-1 shadow d-flex "
          activeclassName="active"
          boxSize="150px"
          style={{
            width: "200px",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => handleMenuItemClick(val.id_category)}
        >
          <Image
            src={`${API_URL}/img/category/${val.category_picture}`}
            alt={val.category}
            borderRadius="md"
            boxSize="100px"
            objectFit="cover"
            borderColor="black"
            borderWidth="1px"
          />
          <Text fontSize="sm" color="black">
            {val.category}
          </Text>
        </Card>
      );
    });
  };

  const printDataCategorySecond = () => {
    let data = dataCategorySecond ? dataCategorySecond : [];

    return data.map((val, idx) => {
      return (
        <Link
          className="card bg-white p-3 m-1 shadow d-flex "
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
            borderColor="black"
            borderWidth="1px"
          />
          <Text fontSize="sm" color="black">
            {val.category}
          </Text>
        </Link>
      );
    });
  };

  const printDataCategoryThird = () => {
    let data = dataCategoryThird ? dataCategoryThird : [];

    return data.map((val, idx) => {
      return (
        <Link
          className="card bg-white p-3 m-1 shadow d-flex "
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
            borderColor="black"
            borderWidth="1px"
          />
          <Text fontSize="sm" color="black">
            {val.category}
          </Text>
        </Link>
      );
    });
  };

  return (
    <div
      // className="shadow"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Text fontSize="2xl" color="#f96c08" className="py-2 px-3">
        Temukan Produk dari Kategori
      </Text>
      <div
        id="carouselCategory"
        className="carousel slide categorycard shadow"
        data-bs-interval="false"
      >
        {/* GAMBAR */}
        <div class="carousel-inner">
          <div class="carousel-item active cate-item">
            {/* CAP */}
            <div class="carousel-caption top-0">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {printDataCategoryFirst()}
              </div>
            </div>
          </div>
          <div class="carousel-item cate-item">
            {/* CAP */}
            <div class="carousel-caption top-0">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {printDataCategorySecond()}
              </div>
            </div>
          </div>
          <div class="carousel-item cate-item">
            {/* CAP */}
            <div class="carousel-caption top-0">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {printDataCategoryThird()}
              </div>
            </div>
          </div>
        </div>
        {/* TOMBOL */}
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselCategory"
          data-bs-slide="prev"
          onClick={() => previous()}
        >
          <span
            className="carousel-control-prev-icon catbutton"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselCategory"
          data-bs-slide="next"
          onClick={() => next()}
        >
          <span
            className="carousel-control-next-icon catbutton"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
export default AllCategory;
