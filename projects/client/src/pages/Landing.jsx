import React from "react";
import {
  Button,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Divider,
  CardFooter,
} from "@chakra-ui/react";

const Landing = (props) => {
  return (
    <div>
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
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <br />
      <div>
        <h1>Kategori</h1>
      </div>
      <div
        className="col-10 row bg-white m-auto card"
        id="carouselExampleIndicators"
        // className="carousel slide m-5 shadow "
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
    </div>
  );
};
export default Landing;
