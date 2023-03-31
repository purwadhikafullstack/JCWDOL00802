import React from "react";
import { Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Landing = (props) => {
  const productItem = [
    {
      path: "/products",
      name: "Makanan Kering",
      img: "https://cdn-brilio-net.akamaized.net/news/2020/09/01/191072/1299678-1000xauto-resep-kue-kering-tradisional.jpg",
    },
    {
      path: "/products",
      name: "Figure",
      img: "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/12/14/a347ad4b-efb1-4f2b-a6b2-ad9d1b8a7b89.jpg",
    },
    {
      path: "/products",
      name: "Tas Slempang Pria",
      img: "https://cf.shopee.co.id/file/d1deb3abf6a3fe764d5abeabe3a83e1f",
    },
    {
      path: "/products",
      name: "Flat Shoes Wanita",
      img: "https://lzd-img-global.slatic.net/g/p/8a0cf492b29ddad44c2cd40c9eb90115.jpg_720x720q80.jpg_.webp",
    },
    {
      path: "/products",
      name: "Toples",
      img: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//94/MTA-12082188/kedaung_toples_hermetico_2_lt-_toples_kaca-_toples_full02_sjplx27.jpg",
    },
    {
      path: "/products",
      name: "Hardisk & Flashdisk",
      img: "https://lzd-img-global.slatic.net/g/p/ad567e2aeaf726a40ca46b47d8fed009.jpg_720x720q80.jpg_.webp",
    },
  ];
  return (
    <div className="bg-white my-5 w-100 p-5 m-auto shadow">
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
                  src={require("../Assets/hitam.jpg")}
                  class="d-block w-100"
                  alt="hitam"
                />
              </div>
              <div class="carousel-item">
                <img
                  src={require("../Assets/biru.jpg")}
                  class="d-block w-100"
                  alt="biru"
                />
              </div>
              <div class="carousel-item">
                <img
                  src={require("../Assets/ungu.jpg")}
                  class="d-block w-100"
                  alt="ungu"
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
      {/* Component CardCategory */}
      <div>
        <Text fontSize="50px" color="#f96c08">
          Kategori
        </Text>
      </div>
      <br />
      {/* CARD CATEGORY BARU */}
      <div className="col-10 row bg-white m-auto card flex d-flex">
        <div className="flex d-flex flex-container">
          {productItem.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="card bg-white my-1 shadow flex "
              activeclassName="active"
              boxSize="150px"
              style={{ width: "10rem", justifyContent: "center" }}
            >
              <div>
                <Image
                  src={item.img}
                  alt={item.name}
                  borderRadius="lg"
                  boxSize="100px"
                  objectFit="cover"
                  // className="my-5"
                />
              </div>
              <div className="link_text my-1">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>
      {/* CARD LAMA */}
      {/* <div>
        <div className="col-10 row bg-white m-auto card flex d-flex">
          <Card maxW="200px" size="sm" maxH="250px" margin="5px">
            <CardBody>
              <Image
                src="https://cdn-brilio-net.akamaized.net/news/2020/09/01/191072/1299678-1000xauto-resep-kue-kering-tradisional.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                boxSize="100px"
                objectFit="cover"
              />
              <br />
              <Heading size="sm">Makanan</Heading>
              <Text>Kering</Text>
            </CardBody>
          </Card>
          <Card maxW="200px" size="sm" maxH="250px" margin="5px">
            <CardBody>
              <Image
                src="https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/12/14/a347ad4b-efb1-4f2b-a6b2-ad9d1b8a7b89.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                boxSize="100px"
                objectFit="cover"
              />
              <br />
              <Heading size="sm">Figure</Heading>
              <Text></Text>
            </CardBody>
          </Card>
          <Card maxW="200px" size="sm" maxH="250px" margin="5px">
            <CardBody>
              <Image
                src="https://cf.shopee.co.id/file/d1deb3abf6a3fe764d5abeabe3a83e1f"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                boxSize="100px"
                objectFit="cover"
              />
              <br />
              <Heading size="sm">Tas Selempang</Heading>
              <Text>Pria</Text>
            </CardBody>
          </Card>
          <Card maxW="200px" size="sm" maxH="250px" margin="5px">
            <CardBody>
              <Image
                src="https://lzd-img-global.slatic.net/g/p/8a0cf492b29ddad44c2cd40c9eb90115.jpg_720x720q80.jpg_.webp"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                boxSize="100px"
                objectFit="cover"
              />
              <br />
              <Heading size="sm">Flat Shoes</Heading>
              <Text>Wanita</Text>
            </CardBody>
          </Card>
          <Card maxW="200px" size="sm" maxH="250px" margin="5px">
            <CardBody>
              <Image
                src="https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//94/MTA-12082188/kedaung_toples_hermetico_2_lt-_toples_kaca-_toples_full02_sjplx27.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                boxSize="100px"
                objectFit="cover"
              />
              <br />
              <Heading size="sm">Toples</Heading>
              <Text></Text>
            </CardBody>
          </Card>
          <Card maxW="200px" size="sm" maxH="250px" margin="5px">
            <CardBody>
              <Image
                src="https://lzd-img-global.slatic.net/g/p/ad567e2aeaf726a40ca46b47d8fed009.jpg_720x720q80.jpg_.webp"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                boxSize="100px"
                objectFit="cover"
              />
              <br />
              <Heading size="sm">Harddisk &</Heading>
              <Text>Flashdisk</Text>
            </CardBody>
          </Card>
        </div>
      </div> */}
    </div>
  );
};
export default Landing;
