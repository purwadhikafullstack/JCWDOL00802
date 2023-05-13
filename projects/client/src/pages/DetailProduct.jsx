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
  IconButton,useToast
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../helper";
import Axios from "axios";
import { AiFillHeart } from "react-icons/ai";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

const DetailPage = (props) => {
  const navigate = useNavigate();
  const [productData, setProductData] = React.useState({});
  const [cartData, setCartData] = React.useState(null);
  const [qty, setQty] = React.useState(1);
  const [stock,setStock]=useState(0)
  const [cart,setCart]=useState(0)
  const [stockOut,setStockOut]=useState(false)
  const [disableMinus,setDisableMinus]= useState(false)
  const [disablePlus,setDisablePlus]= useState(false)
  const [disableAdd, setDisableAdd]=useState(false)
  const { id } = useParams();
  const [isLoved, setIsLoved] = React.useState(false);
  const [disableWishlist, setDisableWishlist]=useState(false)

  const { id_user, status,role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      status: state.userReducer.status,
      role : state.userReducer.role
    };
  });
  let userToken =localStorage.getItem("cnc_login")
  let toast=useToast()
  const getProductDetail = () => {
    Axios.get(`${API_URL}/apis/product/detail?id=${id}`)
      .then((response) => {
        setProductData(response.data);
        setStock(parseInt(response.data.stock));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  useEffect(() => {
    let total = qty+cart
    let admin= [2,3]
    if(admin.includes(role)){
      setDisableAdd(true)
      setDisableWishlist(true)
    }
    if(total >= stock){
      setDisablePlus(true)
    }else setDisablePlus(false)
    if(qty<=1){
      setDisableMinus(true)
    } else{setDisableMinus(false)}

    
    if(qty == 0){
      setDisableAdd(true)
      setDisablePlus(true)
    }
    if(productData && productData.stock==0){
    setDisableAdd(true)
    setStockOut(true)
    setDisablePlus(true)
    setDisableMinus(true)
    setQty(0)}
    ;
  }, [qty,productData,cart,role])
  

  const getCartDetail = async () => {
    if(userToken){
    await Axios.get(`${API_URL}/apis/cart/detail/?id=${id_user}&prod=${id}`,{
        
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    
    })
      .then((response) => {
        setCartData(response.data)
        
        if(!response.data){
          setCart(0);
        }else{
          setCart(response.data.total_item);
        }
      })
      .catch((error) => {
        console.log(error);
        setCart(0)
      });}
  };
  useEffect(() => {
    getCartDetail();
  }, [id_user,userToken]);

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
  const toastMessage=(text,stat)=>{
    toast({
      title: text,
      status: stat,
      duration: 3000,
      isClosable: true,
      position:"top"
    })
    
  }
  const addToCart = async () => {
    
    if (parseInt(productData.stock) == 0) {
      alert("stock kosong nih bos");
    } else if (qty == 0) {
      alert("jumlahnya masih 0, tolong isi dulu ya");
    } else if (status == 2 && parseInt(productData.stock) !== 0 &&userToken) {
      try {
        let id_product = productData.id_product;
      let total_item = qty;
      let addCart =await Axios.post(API_URL + "/apis/cart/addtocart", {
        id_user,
        id_product,
        total_item,
      },{
        
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      
      })
        toastMessage(addCart.data.message,"success")
        getCartDetail()
      } catch (error) {
        toastMessage(error.response.data.message,"error")
      }
    }else if(!userToken){
      navigate("/login", { replace: true });
    }
  };

 

  const toggleLove = () => {
    ;
    //Logic Buat Wishlist
    if(isLoved &&userToken){
      removeWishlist()
    }else if(!isLoved &&userToken){
      addToWishlist()
    }else if(!userToken){
      navigate("/login")
    }
    setIsLoved((prevState) => !prevState)
  };

  //SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getChecker = async ()=>{
    try {
      let checker = await Axios.get(`${API_URL}/apis/wishlist/checker?id=${id}`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      
      setIsLoved(checker.data.isWishlisted)
    } catch (error) {
      
    }
  }
  const addToWishlist = async ()=>{
    try {
      let add = await Axios.post(`${API_URL}/apis/wishlist/wish?id=${id}`,{},{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      ;
      
    } catch (error) {
      
    }
  }
  const removeWishlist = async ()=>{
    try {
      let remove = await Axios.delete(`${API_URL}/apis/wishlist/wish?id=${id}`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      
      
    } catch (error) {
      
    }
  }
  useEffect(() => {
    if(id){
      getChecker()
    }
  }, [id])
  
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
              className= {stockOut? "gambarUnavailable": ""}
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
            <Button onClick={onDec} isDisabled={disableMinus}>-</Button>
            <Input
              type="number"
              value={qty}
              readOnly
              focusBorderColor="blue.500"
              onChange={(e) => {}}
            />
            <Button onClick={onInc}isDisabled={disablePlus}>+</Button>
            
          </HStack>
          <ButtonGroup spacing={2}>
            <Button colorScheme="orange" variant={disableAdd?"ghost":"outline"} onClick={addToCart} isDisabled={disableAdd}>
              Add To Cart
            </Button>
            <IconButton
              isDisabled={disableWishlist}
              aria-label="Add to wishlist"
              icon={<AiFillHeart />}
              variant={isLoved? "ghost":"outline"}
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
