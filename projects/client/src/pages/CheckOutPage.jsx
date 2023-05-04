import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, componentDidMount } from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import {
  Button,
  Flex,
  Image,
  Spacer,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Box,
  Link,
  Stack,
  Radio,
  RadioGroup,
  FormControl,
  FormControlOptions,
  Select,
  FormLabel,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import AddressModal from "../components/CheckOutComponent/AddressModal";

const CheckOut = (props) => {
  const [cartData, setCartData] = useState(null);
  const [productData, setProductData] = React.useState(null);
  const [provinceData, setProvinceData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [total, setTotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [shipment, setShipment] = useState(null);
  const [cost, setCost] = useState(0);
  const [pay, setPay] = useState(0);
  const [warehouseData, setWarehouseData] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courier, setCourier] = useState("");
  const navigate = useNavigate();
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleAddAddress = () => {
    navigate("/profile");
  };
  useEffect(() => {
    document.title = "Cnc || Checkout";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
    unselectAll();
  };
  let getLocalStorage = localStorage.getItem("cnc_login");

  const getCart = async () => {
    await Axios.get(`${API_URL}/apis/cart/selected`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    })
      .then((response) => {
        setCartData(response.data);
        let totaWeight = 0;
        for (let i = 0; i < response.data.length; i++) {
          let added =
            response.data[i].Product.weight * response.data[i].total_item;
          totaWeight += added;
        }

        setTotalWeight(totaWeight);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const { id_user, status } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      status: state.userReducer.status,
    };
  });

  const getSelectedAddress = async () => {
    const getData = await Axios.get(`${API_URL}/apis/address/detail`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setSelectedAddress(response);
    });
  };
  const getAddress = async () => {
    const getData = await Axios.get(`${API_URL}/apis/address/`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setAddress(response.data);
    });
  };

  const getCost = async () => {
    if (totalWeight !== 0 && courier !== "" && typeof courier !== "undefined") {
      let weight = totalWeight;
      let result = await Axios.post(
        `${API_URL}/apis/rajaongkir/ship`,
        { weight, courier: courier },
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        }
      ).then((response) => {
        setShipment(response.data.results[0].costs);
      });
    }
  };

  const selectCourier = () => {
    if (selectedType !== "" && typeof selectedType !== "undefined") {
      let result = shipment.filter((e) => {
        return e.service == selectedType;
      });
      setCost(result[0].cost[0].value);
    }
  };

  const unselectAll = async () => {
    let result = await Axios.get(`${API_URL}/apis/cart/allcartunselect`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    });
    getCart();
  };
  const handleSelect = async (id_address) => {
    try {
      const response = await Axios.post(
        `${API_URL}/apis/address/select`,
        { id_address },
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        }
      );
      getAddress();
      getSelectedAddress();
      setCourier("");
      setSelectedType("");
      setCost(0);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (cartData && cartData.length == 0) {
      navigate("/cart");
    }
    if (!getLocalStorage) {
      navigate("/login");
    } if(status && status == 1){
      navigate("/")
    }
  }, [cartData, getLocalStorage,status]);

  useEffect(() => {
    getCost();
  }, [address, courier, cartData, totalWeight]);
  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    getSelectedAddress();
  }, []);
  useEffect(() => {
    selectCourier();
  }, [selectedType]);
  useEffect(() => {
    getCart();
  }, [id_user]);

  useEffect(() => {
    getTotalCost();
  }, [cartData]);
  useEffect(() => {
    getTotalPay();
  }, [total, cost]);

  const getTotalPay = () => {
    setPay(total + cost);
  };

  const getTotalCost = () => {
    let data = cartData;
    let product = productData;
    if (data !== null) {
      let tempt = 0;
      for (let i = 0; i < data.length; i++) {
        let totalPrice = data[i].total_item * data[i].Product.price;
        tempt += totalPrice;
        setTotal(tempt);
      }
    }
  };

  const getClosestWarehouse = async () => {
    const getData = await Axios.get(`${API_URL}/apis/trans/warehouse`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setSelectedOrigin(response.data.key_city);
    });
  };
  const getDate = async () => {
    let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
    let add = selectedAddress.data[0].detail_address;

    let result = await Axios.post(
      `${API_URL}/apis/trans/add`,
      {
        date: tanggal,
        shipment_fee: cost,
        shipment_service: `${courier} ${selectedType}`,
        total_price: total,
        weight: totalWeight,
        address: selectedAddress.data[0].detail_address,
      },
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    );
    navigate("/transaction")
  };

  const printData = () => {
    let data = cartData;

    return data?.map((val, idx) => {
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
              <Text fontSize="lg" fontWeight="bold" mr={2}>
                {val.total_item}
              </Text>
            </Box>
          </Flex>
        </Box>
      );
    });
  };
  const handleChangeCourier = (event) => {
    setCourier(event.target.value);
  };

  const printService = () => {
    return (
      <Box
        p="4"
        border="1px solid #ddd"
        borderRadius="4px"
        bg="gray"
        rounded="md"
      >
        <FormControl id="courier">
          <FormLabel fontWeight="bold">Pilih Kurir</FormLabel>
          <RadioGroup onChange={(e) => setCourier(e.target.value)}>
            <Stack spacing={3}>
              <Select
                className="form-select"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              >
                <option value="">Pilih Kurir</option>

                <option value="jne">JNE</option>
                <option value="pos">POS</option>
                <option value="tiki">TIKI</option>
              </Select>
              {courier !== "" && typeof courier !== "undefined" && (
                <Select
                  className="form-select"
                  placeholder="Pilih Layanan"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {shipment?.map((val, index) => (
                    <option key={index} value={val?.service}>
                      {val?.service}, {val?.cost[0].value}, {val?.cost[0].etd}
                    </option>
                  ))}
                </Select>
              )}
            </Stack>
          </RadioGroup>
        </FormControl>
      </Box>
    );
  };

  return (
    <div>
      <div className=" fs-3 mx-5">
        <strong>Checkout</strong>
      </div>
      <div className="container-fluid">
        <div className="row">
          {/* bagian barang */}
          <div className="row col-8">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flex: "1",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Selected Address
                </h2>
                {selectedAddress ? (
                  <div
                    style={{
                      backgroundColor: "#f8f8f8",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <p style={{ margin: "0", fontWeight: "bold" }}>
                      {selectedAddress.data[0].receiver}
                    </p>
                    <p style={{ margin: "0", fontSize: "14px" }}>
                      {selectedAddress.data[0].detail_address}
                    </p>
                    <p style={{ margin: "0", fontSize: "14px" }}>
                      {selectedAddress.data[0].phone_number}
                    </p>
                  </div>
                ) : (
                  <p>No address selected</p>
                )}
              </div>
              <button
                style={{
                  backgroundColor: "#fff",
                  color: "orange",
                  variant: "outline",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "2px solid orange",
                  borderColor: "f96c08",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                Pilih Alamat Lain
              </button>
            </div>
            <AddressModal
              addresses={address}
              selectedAddress={selectedAddress}
              onSelect={handleSelect}
              onClose={() => setIsModalOpen(false)}
              isOpen={isModalOpen}
            />

            <div className="col-8 py-1">{printData()}</div>
            <div className="col-4 py-3">{printService()}</div>
          </div>
          {/* bagian cost dll */}
          <div className="col-3 mx-2 py-2 rounded-lg border border-gray-200">
            <div className="col-auto pb-2 rounded-lg border border-gray-200 bg-white">
              <Button
                colorScheme={cost === 0 ? "gray" : "orange"}
                variant="outline"
                isDisabled={cost === 0}
                rounded="lg"
                width="100%"
                mt={2}
              >
                Makin Hemat Pake Promo
              </Button>
            </div>
            <div className="row col-auto py-3">
              <div className="row col-12">
                <h3 className="col-8">Biaya Pengiriman </h3>
                <h3 className="col-4 text-right">Rp.{cost.toLocaleString()}</h3>
              </div>
              <div className="row col-12">
                <h3 className="col-8">Total harga Barang </h3>
                {totalWeight >= 1000 && (
                  <h3 className="col-4 text-right">{totalWeight / 1000} Kg</h3>
                )}

                {totalWeight < 1000 && (
                  <h3 className="col-4 text-right">{totalWeight} gram</h3>
                )}
              </div>

              <div className="row col-12 py-2">
                <h2 className="col-7 font-weight-bold">Total Bayar</h2>
                <h2 className="col-5 text-right d-flex justify-content-end">
                  <strong>
                    {cost === 0 ? "-" : `Rp.${pay.toLocaleString()}`}
                  </strong>
                </h2>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <Button
                  colorScheme={cost === 0 ? "gray" : "orange"}
                  isDisabled={cost === 0}
                  onClick={getDate}
                  mt={4}
                  size="lg"
                  width="100%"
                >
                  Beli
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
