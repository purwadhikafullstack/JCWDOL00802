import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  ButtonGroup,
  Input,
  Select,
} from "@chakra-ui/react";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function AdminProducts() {
  // STATE
  const [dataProduct, setDataProduct] = useState([]);
  const [dataWarehouse, setDataWarehouse] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  // GET DATA
  const getWarehouse = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehouse`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setDataWarehouse(response.data);
    });
  };

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
    });
  };

  const getProduct = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let products = await Axios.post(
        API_URL + `/apis/product/list`,
        {
          search,
          warehouse: selectedWarehouse,
          category: selectedCategory,
          order,
          limit,
          page: parseInt(page) - 1,
          minPrice,
          maxPrice,
        },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      setPage(products.data.page + 1);
      setDataProduct(products.data.data);
      setLastPage(products.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

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
    getWarehouse();
  }, []);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getProduct();
  }, [selectedWarehouse, page, limit, onFilter]);

  //PRINT DATA
  const printSelectWarehouse = () => {
    let data = dataWarehouse;
    if (dataWarehouse) {
      return data.map((val, idx) => {
        if (val.status == 2 || val.status == 1) {
          return (
            <option
              value={val?.id_warehouse}
              selected={val.id_warehouse == selectedWarehouse}
            >
              {val?.warehouse_branch_name}
            </option>
          );
        }
      });
    }
  };

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
    let data = dataProduct ? dataProduct : [];
    return data.map((val, idx) => {
      let editpage = `/admin/editproduct?id_product=${val.id_product}`;
      return (
        <Tr>
          <Td>
            <img
              src={`${API_URL}/img/product/${val.product_picture}`}
              className="img-thumbnail"
              alt=""
              style={{ height: "100px", width: "100px", objectFit: "cover" }}
            />
          </Td>
          <Td>{val.name}</Td>
          <Td>{val.price}</Td>
          <Td>{val.total_stock}</Td>
          <Td>
            <ButtonGroup>
              <Link to={editpage}>
                <Button type="button" colorScheme="orange" variant="solid">
                  Detail Produk
                </Button>
              </Link>
            </ButtonGroup>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <div className="paddingmain">
      <div>
        <Text fontSize="2xl">Daftar Produk</Text>
      </div>
      <div className=" d-flex">
        <div className="col-9 rounded p-3 tablebox">
          <TableContainer className="rounded">
            <Table size="sm">
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">Info Produk</Th>
                  <Th color="#ffffff"></Th>
                  <Th color="#ffffff">Harga</Th>
                  <Th color="#ffffff">Stok</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody className="tablebody">{printData()}</Tbody>
            </Table>
          </TableContainer>
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
          <div>Gudang</div>
          <div className="inputfilter">
            <Select
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="form-control form-control-lg mt-3"
            >
              {role == 3 && <option value="">all warehouse</option>}
              {printSelectWarehouse()}
            </Select>
          </div>
          <br />
          <hr />
          <br />
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
              className="form-control form-control-lg mt-3"
            >
              <option value="">Semua Kategori</option>
              <option value={0}>Kategori Nihil</option>
              {printCategory()}
            </Select>
          </div>
          <div className="inputfilter">
            <Select
              onChange={(e) => setOrder(e.target.value)}
              className="form-control form-control-lg mt-3"
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

export default AdminProducts;
