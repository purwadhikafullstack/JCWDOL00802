import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, componentDidMount } from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import {
  Text,
  Button,
  ButtonGroup,
  Link,
  Box,
  Flex,
  Card,
  Image,
  IconButton,
  HStack,
  Checkbox,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";

import { useNavigate, useParams } from "react-router-dom";
import Wishlist from "../components/cartComponent/Wishlist";

const Cart = (props) => {
  const userToken = localStorage.getItem("cnc_login");

  const [cartData, setCartData] = React.useState([]);
  const [wishlistData,setWishlistData]=useState([])
  const [dataExist, setDataExist] = useState(false);
  const [productData, setProductData] = React.useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalBarang, setTotalBarang] = useState(0);
  const [selectedAll, setSelectedAll] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const getCart = async () => {
    await Axios.get(`${API_URL}/apis/cart/getcart`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        setCartData(response.data);

        if (response.length > 0) {
          setDataExist(true);
        } else {
          setDataExist(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { status, role } = useSelector((state) => {
    return {
      status: state.userReducer.status,
      role: state.userReducer.role,
    };
  });
  const getData = async ()=>{
    try {
      let data = await Axios.get(`${API_URL}/apis/wishlist/`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      if (data.data.data.length >0){
        
        setWishlistData(data.data.data)
      } else{
        
        setWishlistData(null)
      }
    } catch (error) {
      
    }
  }
  const messageAuthorize = () => {
    if (!userToken) {
      toast({
        title: "Silahkan login dulu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else if (role & (role !== 1)) {
      toast({
        title: "Admin tidak bisa mengakses ini!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const toastMessage = (text, status) => {
    toast({
      title: text,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };
  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    } else if (role && role !== 1) {
      navigate("/");
    } else if (status && status == 1) {
      navigate("/");
    }
    messageAuthorize();
  }, [role, userToken, status]);

  useEffect(() => {
    getCart();
    getData()
  }, []);

  useEffect(() => {
    getTotalPrice();
  }, [cartData]);
  useEffect(() => {
    selectedChecker();
  }, [cartData]);

  useEffect(() => {
    document.title = "Cnc || keranjang";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };
  const selectedChecker = () => {
    let checker = cartData.filter((e) => e.selected == 1);
    if (checker.length == cartData.length) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
    }
  };
  const onDec = async (arg, arg2) => {
    let id_cart = arg;
    if (arg2 > 1) {
      await Axios.post(
        `${API_URL}/apis/cart/dec`,
        { id_cart },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
        .then((response) => {
          toastMessage(response.data.message, "success");
          getCart();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if ((arg2 = 1)) {
      delCart(arg);
    }
  };
  const onInc = async (id_cart, total_item, stock) => {
    if (total_item < stock) {
      await Axios.post(
        `${API_URL}/apis/cart/inc`,
        { id_cart },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
        .then((response) => {
          toastMessage(response.data.message, "success");
          getCart();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (total_item == stock) {
      alert("sudah max");
    }
  };
  const delCart = async (arg) => {
    let text = `apakah anda yakin akan menghapus ini?`;
    if (window.confirm(text)) {
      await Axios.delete(`${API_URL}/apis/cart/?id=${arg}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => {
          toastMessage(response.data.message, "success");
          getCart();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const selectAll = async (checked) => {
    if (checked) {
      let result = await Axios.get(`${API_URL}/apis/cart/allcartselect`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setSelectedAll(true);
      getCart();
    } else {
      unselectAll();
      setSelectedAll(false);
    }
  };
  const unselectAll = async () => {
    let result = await Axios.get(`${API_URL}/apis/cart/allcartunselect`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    getCart();
  };

  const getTotalPrice = () => {
    if (cartData.length > 0) {
      setTotalPrice(0);
      setTotalBarang(0);
      let data = cartData.filter((e) => {
        return e.selected == 1;
      });
      let temptBar = 0;
      let tempt = 0;
      for (let i = 0; i < data.length; i++) {
        let priceHere = data[i].Product.price * data[i].total_item;
        temptBar += data[i].total_item;
        tempt += priceHere;
      }
      setTotalPrice(tempt);
      setTotalBarang(temptBar);
    }
  };

  const onSelect = async (id_cart, checked) => {
    try {
      let selector = await Axios.post(
        API_URL + `/apis/cart/updatecart`,
        { selected: checked ? "1" : "0", id_cart },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      getCart();
    } catch (error) {
      console.log(error);
    }
  };
  const handleBuyClick = () => {
    if (totalPrice !== 0) {
      navigate("/checkout");
    }
  };

  const printData = () => {
    let data = cartData;

    return data.map((val, idx) => {
      let image = `${API_URL}/img/product/${val.Product.product_picture}`;
      return (
        <Box
          key={val?.id_cart}
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
          m={2}
          boxShadow="sm"
          width={{ base: "100%" }}
        >
          <Flex alignItems="center">
            <Checkbox
              size="lg"
              name={val?.id_cart}
              isChecked={val?.selected == 1}
              bg="gray.50"
              colorScheme="orange"
              onChange={(event) =>
                onSelect(event.target.name, event.target.checked)
              }
              mr={2}
              ml={2}
            />
            <Image
              src={image}
              alt={val?.Product.name}
              objectFit="cover"
              height="8rem"
              width="8rem"
            />
            <Box p={4}>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {val?.Product.name}
              </Text>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Rp{val?.Product.price.toLocaleString()},-
              </Text>
            </Box>
            <Spacer />
            <Box display="flex" alignItems="center" pr={4}>
              <IconButton
                
                icon={<Text fontSize="2xl">-</Text>}
                colorScheme="orange"
                isRound
                size="sm"
                onClick={() => onDec(val?.id_cart, val?.total_item)}
                mr={2}
              />
              <Text fontSize="lg" fontWeight="bold" mr={2}>
                {val.total_item}
              </Text>
              <IconButton
                isDisabled={val.total_item == parseInt(val.Product.stock)}
                icon={<Text fontSize="2xl">+</Text>}
                colorScheme="orange"
                isRound
                size="sm"
                onClick={() =>
                  onInc(val?.id_cart, val?.total_item, val?.Product.stock)
                }
                mr={2}
              />
              <IconButton
                aria-label="delete"
                icon={<FaTrash />}
                colorScheme="orange"
                isRound
                size="sm"
                onClick={() => delCart(val?.id_cart)}
              />
            </Box>
          </Flex>
        </Box>
      );
    });
  };

  return (
    <div className="container-fluid pt-3 ">
      <div className="row">
        {/* jarak kiri */}
        <div className="col-2"></div>
        {/* bagian tengah */}
        <div className="row col-6  mx-1 pb-2">
          <h1 className="ms-2 mt-2 fs-2">
            <strong>Keranjang</strong>
          </h1>
          <div>
            {cartData.length == 0 && (
              <div>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100vh"
                >
                  <RiShoppingCartLine size={64} color="#c3c7d1" />
                  <Text
                    fontSize="lg"
                    fontWeight="medium"
                    color="#424749"
                    marginTop={4}
                    textAlign="center"
                  >
                    Kamu belum ada barang yang dikeranjang nih
                  </Text>
                  <Button
                    onClick={() => {
                      navigate("/product");
                    }}
                    variant="outline"
                    colorScheme="orange"
                    marginTop={4}
                    leftIcon={<RiShoppingCartLine />}
                  >
                    Check Product
                  </Button>
                </Box>
              </div>
            )}
            {cartData.length > 0 && (
              <Checkbox
                mt={4}
                size="lg"
                isChecked={selectedAll}
                bg="gray.50"
                colorScheme="orange"
                onChange={(e) => selectAll(e.target.checked)}
              >
                Select All
              </Checkbox>
            )}
            <div className="col-12">{printData()}</div>

        <div className="col-12 my-5">
            <h3><strong>Wishlist Item</strong></h3>
          
          <div className="my-1 py-1">
          <Wishlist  wishlist={wishlistData} getData={getData} getCart={getCart}/>
          </div>
        </div>
    
          </div>
        </div>
        {/* bagian kanan */}

        <div className="col-3 mx-2 py-2 rounded-lg border border-gray-200">
          <div className="col-auto pb-2 rounded-lg border border-gray-200 bg-white ">
            <Button
              colorScheme={totalBarang === 0 ? "gray" : "orange"}
              variant="outline"
              isDisabled={totalBarang === 0}
              rounded="lg"
              width="100%"
              mt={2}
            >
              Makin Hemat Pake Promo
            </Button>
          </div>
          <div className="row col-auto py-3 ">
            <h2 className="col-12 font-weight-bold">Ringkasan Belanja</h2>
            <div className="row col-12">
              <h3 className="col-8">Total harga ({totalBarang} barang)</h3>
              <h3 className="col-4 text-right">
                Rp.{totalPrice.toLocaleString()}
              </h3>
            </div>
            <div className="row col-12 py-2">
              <h2 className="col-7 font-weight-bold">Total Harga</h2>
              <h2 className="col-5 d-flex justify-content-end">
                <strong>
                  {totalPrice === 0 ? "-" : `Rp.${totalPrice.toLocaleString()}`}
                </strong>
              </h2>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <Button
                colorScheme={totalBarang === 0 ? "gray" : "orange"}
                isDisabled={totalBarang === 0}
                onClick={handleBuyClick}
                mt={4}
                size="lg"
                width="100%"
              >
                Beli ({totalBarang})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
