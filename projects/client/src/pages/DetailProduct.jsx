import React, { useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Flex,
  VStack,
  Image,
  Stack,
  Box,
  Heading,
  Text,
  Divider,
  HStack,
  Button,
  ButtonGroup,
  Input,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../helper";
import Axios from "axios";
import { FiHeart } from "react-icons/fi";

import { useSelector, useDispatch } from "react-redux";

const DetailPage = (props) => {
  const navigate = useNavigate;
  const [productData, setProductData] = React.useState({});
  const [cartData, setCartData] = React.useState(null);
  const [qty, setQty] = React.useState(0);
  const { id } = useParams();
  const [isLoved, setIsLoved] = React.useState(false);

  const { id_user, status } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      status: state.userReducer.status,
    };
  });
  const getProductDetail = () => {
    Axios.get(`${API_URL}/apis/product/detail?id=${id}`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  const getCartDetail = async () => {
    await Axios.get(`${API_URL}/apis/cart/detail/?id=${id_user}&prod=${id}`)
      .then((response) => {
        setCartData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCartDetail();
  }, [id_user]);

  const onInc = () => {
    if (cartData == null) {
      if (qty < parseInt(productData.stock)) {
        setQty(qty + 1);
      }
      if (qty == parseInt(productData.stock)) {
        alert(
          "sudah maksimal nih bos yang disini dibandingin dengan stock kita"
        );
      }
    } else {
      let total = qty + cartData.total_item;

      if (total < parseInt(productData.stock)) {
        setQty(qty + 1);
      }
      if (total == parseInt(productData.stock)) {
        alert(
          "sudah maksimal nih bos yang disini ditambah yang dikeranjang bos dibandingin dengan stock kita"
        );
      }
    }
  };

  const onDec = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };
  const addToCart = () => {
    if (parseInt(productData.stock) == 0) {
      alert("stock kosong nih bos");
    } else if (qty == 0) {
      alert("jumlahnya masih 0, tolong isi dulu ya");
    } else if (status == 2 && parseInt(productData.stock) !== 0) {
      let id_product = productData.id_product;
      let total_item = qty;
      Axios.post(API_URL + "/apis/cart/addtocart", {
        id_user,
        id_product,
        total_item,
      })
        .then((res) => {
          alert(res.data.message);
          getCartDetail();
          setQty(0);

          if (res.data.success) {
            navigate("/cart");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (parseInt(productData.stock) == 0) {
      alert("stock abis bos");
    } else {
      navigate("/login", { replace: true });
    }
  };

  const checkTotal = () => {
    if (cartData == null) {
      alert("on cart = 0");
    } else alert(` on cart = ${cartData.total_item}`);
  };

  const toggleLove = () => {
    setIsLoved((prevState) => !prevState);
    //Logic Buat Wishlist
  };

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
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <VStack>
            <Image
              rounded={"md"}
              alt={"product image"}
              src={`${API_URL}/img/product/${productData.product_picture}`}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          </VStack>
        </Flex>
        <Stack spacing={{ base: 4, md: 6 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={490}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {productData.name}
            </Heading>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={300}
              fontSize={"xl"}
            >
              Rp. {parseInt(productData.price).toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text fontSize={"md"}>{productData.description}</Text>
          </Box>
          <Box>
            <Text fontSize={"md"}>
              <b>Weight: </b>
              {productData.weight
                ? `${productData.weight} grams`
                : "Loading..."}
            </Text>
          </Box>

          <Divider />
          <HStack maxW="180px">
            <Button onClick={onInc}>+</Button>
            <Input
              type="number"
              value={qty}
              readOnly
              focusBorderColor="blue.500"
              onChange={(e) => {}}
            />
            <Button onClick={onDec}>-</Button>
          </HStack>
          <ButtonGroup spacing={2}>
            <Button colorScheme="orange" variant="solid" onClick={addToCart}>
              Add To Cart
            </Button>
            <IconButton
              aria-label="Add to wishlist"
              icon={<FiHeart />}
              colorScheme={isLoved ? "red" : "gray"}
              onClick={toggleLove}
            />
          </ButtonGroup>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default DetailPage;
