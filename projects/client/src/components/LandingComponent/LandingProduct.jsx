import { useEffect, useState } from "react";
import Axios from "axios";
import { API_URL } from "../../helper";
import { Link } from "react-router-dom";
import { Badge, Image, Text } from "@chakra-ui/react";

function LandingProduct() {
  const [dataProduct, setDataProduct] = useState([]);

  const getProduct = async () => {
    try {
      let product = await Axios.post(API_URL + `/apis/product/productlanding`, {
        page: 0,
        limit: 20,
      });
      setDataProduct(product.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const printDataProduct = () => {
    let data = dataProduct ? dataProduct : [];

    return data.map((val, idx) => {
      let link = `/product/detail/${val.id_product}`;
      let nama = val.name;
      return (
        <Link
          to={link}
          className="card bg-white p-3 m-2 shadow col-md-3"
          activeclassName="active"
          boxSize="150px"
          style={{
            width: "200px",
            height: "250px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={`${API_URL}/img/product/${val.product_picture}`}
            alt={val.name}
            borderRadius="md"
            boxSize="100px"
            objectFit="cover"
            borderColor="black"
            borderWidth="1px"
          />
          <Text fontSize="sm" color="black" className="m-3">
            {nama.substring(0, 30)}
          </Text>

          <Text fontSize="sm" color="black" className="m-3">
            Rp. {Intl.NumberFormat().format(val.price)}
          </Text>
        </Link>
      );
    });
  };

  return (
    <div className="productbox">
      <div className="d-flex justify-content-between">
        <Text fontSize="2xl" color="#f96c08" className="py-2 px-3">
          Produk Terbaru
        </Text>
        <a href="/product" className="my-2">
          <Badge colorScheme="orange" style={{ height: "auto" }}>
            All Products →
          </Badge>
        </a>
      </div>
      <div
        className="d-flex flex-wrap"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {printDataProduct()}
      </div>
    </div>
  );
}
export default LandingProduct;
