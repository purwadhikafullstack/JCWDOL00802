import { useEffect, useState } from "react";
import Axios from "axios";
import { API_URL } from "../../helper";
import { Text, Input } from "@chakra-ui/react";

function PromoCode() {
  const [page, setPage] = useState(1);
  const [slide, setSlide] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [dataPromoFirst, setDataPromoFirst] = useState({});
  const [dataPromoSecond, setDataPromoSecond] = useState({});
  const [dataPromoThird, setDataPromoThird] = useState({});

  const getPromo = async (type, halaman) => {
    try {
      let promo = await Axios.get(
        API_URL + `/apis/promo/getpromolanding?page=${halaman}`
      );
      setLastPage(promo.data.total_page);
      if (type == 1) {
        setDataPromoFirst(promo.data.data[0]);
      } else if (type == 2) {
        setDataPromoSecond(promo.data.data[0]);
      } else if (type == 3) {
        setDataPromoThird(promo.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromo(1, 1);
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
      getPromo(3, temp);
      setSlide(3);
    } else if (slide == 2) {
      getPromo(1, temp);
      setSlide(1);
    } else if (slide == 3) {
      getPromo(2, temp);
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
      getPromo(2, temp);
      setSlide(2);
    } else if (slide == 2) {
      getPromo(3, temp);
      setSlide(3);
    } else if (slide == 3) {
      getPromo(1, temp);
      setSlide(1);
    }
  };

  const printDataPromoFirst = () => {
    let data = dataPromoFirst
      ? dataPromoFirst
      : { promo_code: "", description: "" };
    return (
      <div className="d-flex">
        <div className="promobox">
          <Text fontSize="md" color="#f96c08">
            Kode Promo:
          </Text>
          <Text fontSize="2xl" color="#f96c08">
            {data?.promo_code}
          </Text>
        </div>
        <div>
          <Text fontSize="md" color="#f96c08" className="promodetail">
            {data?.description}
          </Text>
        </div>
      </div>
    );
  };

  const printDataPromoSecond = () => {
    let data = dataPromoSecond
      ? dataPromoSecond
      : { promo_code: "", description: "" };
    return (
      <div className="d-flex">
        <div className="promobox">
          <Text fontSize="md" color="#f96c08">
            Kode Promo:
          </Text>
          <Text fontSize="2xl" color="#f96c08">
            {data?.promo_code}
          </Text>
        </div>
        <div>
          <Text fontSize="md" color="#f96c08" className="promodetail">
            {data?.description}
          </Text>
        </div>
      </div>
    );
  };

  const printDataPromoThird = () => {
    let data = dataPromoThird
      ? dataPromoThird
      : { promo_code: "", description: "" };
    return (
      <div className="d-flex">
        <div className="promobox">
          <Text fontSize="md" color="#f96c08">
            Kode Promo:
          </Text>
          <Text fontSize="2xl" color="#f96c08">
            {data?.promo_code}
          </Text>
        </div>
        <div>
          <Text fontSize="md" color="#f96c08" className="promodetail">
            {data?.description}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div
      // className="shadow"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Text fontSize="2xl" color="#f96c08" className="py-2 px-3">
        Promo Menarik Untukmu
      </Text>
      <div
        id="carouselPromo"
        className="carousel slide promocard shadow"
        data-bs-interval="false"
      >
        {/* GAMBAR */}
        <div class="carousel-inner">
          <div class="carousel-item active promo-item">
            {/* CAP */}
            <div class="carousel-caption top-0">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {printDataPromoFirst()}
              </div>
            </div>
          </div>
          <div class="carousel-item promo-item">
            {/* CAP */}
            <div class="carousel-caption top-0">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {printDataPromoSecond()}
              </div>
            </div>
          </div>
          <div class="carousel-item promo-item">
            {/* CAP */}
            <div class="carousel-caption top-0">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {printDataPromoThird()}
              </div>
            </div>
          </div>
        </div>
        {/* TOMBOL */}
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselPromo"
          data-bs-slide="prev"
          onClick={() => previous()}
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselPromo"
          data-bs-slide="next"
          onClick={() => next()}
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
export default PromoCode;
