import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Box,
  Flex,
  Image,
  Heading,
  Stack,
  Button,
  ButtonGroup,
  Input,
  Select,
} from "@chakra-ui/react";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function Products() {
  // STATE
  const [dataProduct, setDataProduct] = useState(null);
  const [dataCategory, setDataCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
 
  // GET DATA

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
    });
  };

  const getProduct = async () => {
    try {
      
      let products = await Axios.post(
        API_URL + `/apis/product/listproduct`,
        {
          search,
          category: selectedCategory,
          order,
          limit,
          page: parseInt(page) - 1,
          minPrice,
          maxPrice,
        }
      );
      setPage(products.data.page + 1);
      setDataProduct(products.data.data);
      setLastPage(products.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };
  let location = useLocation()

  useEffect(() => {
    console.log(location);
    if(location.state.id_category){
      setSelectedCategory(location.state.id_category)
    }
    
  }, [location])
  

  let dataProductExist = false;
  if (dataProduct == null) {
    dataProductExist = false;
  } else {
    dataProductExist = true;
  }

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (
      search != "" ||
      selectedCategory != "" ||
      order != 0 ||
      minPrice != "" ||
      maxPrice != ""
    ) {
      setPage(1);
      setOnFilter(true);
      getProduct();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setSelectedCategory("");
    setOrder(0);
    setMinPrice("");
    setMaxPrice("");
    setOnFilter(false);
  };

  //USE EFFECT
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getProduct();
  }, [page, limit, onFilter,selectedCategory]);

  //PRINT DATA
  const printCategory = () => {
    let data = dataCategory;
    if (dataCategory) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.id_category}
            selected={val.id_category == selectedCategory}
          >
            {val?.category}
          </option>
        );
      });
    }
  };

  const printData = () => {
    let data = dataProductExist ? dataProduct : [];
    return data.map((val, idx) => {
      let detailproduct = `/product/detail/${val.id_product}`
      return (
        <Flex
          flexBasis={['100%', '50%', '25%']} // 100% for mobile, 50% for tablet, 25% for desktop
          direction="column"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          maxW="sm"
          boxShadow="lg"
          mx={3}
          my={6}
        >
          <Image
            src={`${API_URL}/img/product/${val.product_picture}`}
            alt={val.name}
            h="200px"
            w="100%"
            objectFit="cover"
          />
          <Box p="6">
            <Stack spacing={2}>
              <Heading as="h4" size="md">
                {val.name}
              </Heading>
              <Text>Harga: {val.price}</Text>
            </Stack>
            <ButtonGroup mt={4}>
              <Link to={detailproduct}>
                <Button colorScheme="orange" variant="solid">
                  Detail Produk
                </Button>
              </Link>
            </ButtonGroup>
          </Box>
        </Flex>
      );
    });
  };



  return (
    <div className="bg-white w-100 m-auto">
   <Box pl={10}>
    <Text fontSize="2xl">Daftar Produk</Text>
</Box>
      <div className=" d-flex">
        <div className="col-9 rounded p-3">
          <Flex
            className=" d-flex"
            flexWrap="wrap"
            justifyContent="center"
          >
            {printData()}
          </Flex>
          <div
            className="d-flex my-5"
            style={{ alignContent: "center", justifyContent: "center" }}
          >
                <PaginationOrder
              currentPage={parseInt(page)}
              totalPages={parseInt(lastPage)}
              onPageChange={setPage}
              maxLimit={0}
            />
            <div
              className="d-flex mx-5"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              menampilkan
              <Input
              type="text"
              className="form-control"
              placeholder="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              style={{ width: "60px" }}
            />
            barang
          </div>
        </div>
      </div>
      <div className="col-3 rounded shadow mt-3 p-3 filterbox">
        <div>Filter</div>
        <div className="inputfilter">
          <Input
            type="text"
            className="form-control mt-3"
            placeholder="Cari nama produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="inputfilter">
          <Select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control form-control-lg mt-3
        "
          >
            <option value="">Semua Kategori</option>
            {printCategory()}
          </Select>
        </div>
        <div className="inputfilter">
          <Select
            onChange={(e) => setOrder(e.target.value)}
            className="form-control form-control-lg mt-3
        "
          >
            <option value={0}>Urutkan</option>
            <option value={1} selected={order == 1}>
              Nama:A-Z
            </option>
            <option value={2} selected={order == 2}>
              Nama:Z-A
            </option>
            <option value={3} selected={order == 3}>
              Harga Terendah
            </option>
            <option value={4} selected={order == 4}>
              Harga Tertinggi
            </option>
          </Select>
        </div>
        <div className="inputfilter">
          <Input
            type="text"
            placeholder="harga min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="form-control form-control-lg mt-3"
          />
        </div>
        <div className="inputfilter">
          <Input
            type="text"
            placeholder="harga max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-control form-control-lg mt-3"
          />
        </div>
        <br />
        <ButtonGroup>
          <Button
            type="button"
            colorScheme="orange"
            variant="solid"
            onClick={() => onSetFilter()}
          >
            Set Filter
          </Button>
          <Button
            type="button"
            colorScheme="orange"
            variant={onFilter ? "solid" : "outline"}
            onClick={() => onResetFilter()}
            isDisabled={!onFilter}
          >
            Reset Filter
          </Button>
        </ButtonGroup>
      </div>
    </div>
  </div>
);

}

export default Products;