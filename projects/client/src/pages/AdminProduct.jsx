import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";

function AdminProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // STATE
  const [dataProduct, setDataProduct] = useState(null);
  const [dataWarehouse, setDataWarehouse] = useState();
  const [dataCategory, setDataCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [search, setSearch] = useState("");
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
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
    let getLocalStorage = localStorage.getItem("cnc_login");
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
        },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      console.log(`dataaa`, products.data);
      setDataProduct(products.data);
    } catch (error) {
      console.log(error);
    }
  };

  let dataProductExist = false;
  if (dataProduct == null) {
    dataProductExist = false;
  } else {
    dataProductExist = true;
  }

  //USE EFFECT
  useEffect(() => {
    getWarehouse();
  }, [id_user]);

  useEffect(() => {
    getCategory();
  }, [id_user]);

  useEffect(() => {
    getProduct();
  }, [selectedCategory, selectedWarehouse, search]);

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
    let data = dataProductExist ? dataProduct : [];
    console.log(data);
    return data.map((val, idx) => {
      let editpage = `/admin/editproduct?id_product=${val.id_product}`;
      let requestpage = `/admin/requeststock?id_product=${val.id_product}`;
      return (
        <Tr>
          <Td>{val.id_product}</Td>
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
              <Link to={requestpage}>
                <Button type="button" colorScheme="orange" variant="solid">
                  Request Stok
                </Button>
              </Link>
            </ButtonGroup>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <div className="bg-white  w-100 p-5 m-auto">
      <div className="d-flex">
        <div className="align-center col-4">
          <Text className="ps-4 pt-3" fontSize="4xl">
            {" "}
            Products Page
          </Text>
        </div>
        <div className="col-8 flex d-flex row">
          <div className="col-4">
            <input
              type="text"
              className="form-control p-3"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-4">
            <select
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="form-control form-control-lg mt-3
          "
            >
              {role == 3 && <option value="">all warehouse</option>}
              {printSelectWarehouse()}
            </select>
          </div>
          <div className="col-4">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control form-control-lg mt-3
          "
            >
              <option value="">all category</option>
              {printCategory()}
            </select>
          </div>
        </div>
      </div>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>Product Name</Th>
              <Th>Harga</Th>
              <Th>Stok</Th>
              <Th>
                {role == 3 && (
                  <Link to="/admin/newproduct">
                    <Button type="button" colorScheme="orange" variant="solid">
                      Tambah Produk Baru
                    </Button>
                  </Link>
                )}
              </Th>
            </Tr>
          </Thead>
          <Tbody>{printData()}</Tbody>
          <Tfoot>
            <Tr>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AdminProducts;
