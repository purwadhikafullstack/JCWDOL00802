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

function AdminOrderList() {
  // STATE
  const [dataOrderList, setDataOrderList] = useState(null);
  const [dataWarehouse, setDataWarehouse] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
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

  const getTransaction = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let products = await Axios.post(
        API_URL + `/apis/trans/listall`,
        {
          search,
          warehouse: selectedWarehouse,
          order,
          limit,
          status,
          page: parseInt(page) - 1,
        },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      setPage(products.data.page + 1);
      setDataOrderList(products.data.data);
      setLastPage(products.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  let dataOrderListExist = false;
  if (dataOrderList == null) {
    dataOrderListExist = false;
  } else {
    dataOrderListExist = true;
  }

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (
      search != "" ||
      order != 0 ||
      status != ""
    ) {
      setPage(1);
      setOnFilter(true);
      getTransaction();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setOrder(0);
    setOnFilter(false);
  };

  //USE EFFECT
  useEffect(() => {
    getWarehouse();
  }, []);

  useEffect(() => {
    getTransaction();
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

  const printData = () => {
    let data = dataOrderListExist ? dataOrderList : [];
    return data.map((val, idx) => {
      let detailpage = `/admin/order-detail?id_transaction=${val.id_transaction}`;
      return (
        <Tr>
          <Td>{val.alamat_pengiriman.receiver}</Td>
          <Td>{val.Transaction_status.description}</Td>
          <Td>
            <ButtonGroup>
              <Link to={detailpage}>
                <Button type="button" colorScheme="orange" variant="solid">
                  Detail Transaksi
                </Button>
              </Link>
            </ButtonGroup>
          </Td>
        </Tr>
      );
    });
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Admin Order List";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };

  return (
    <div className="bg-white w-100 m-auto">
      <div>
        <Text fontSize="2xl">Daftar Transaksi</Text>
      </div>
      <div className=" d-flex">
        <div className="col-9 rounded p-3 tablebox">
          <TableContainer className="rounded">
            <Table size="sm">
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">Nama Penerima</Th>
                  <Th color="#ffffff">Status Transaksi</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody className="tablebody">{printData()}</Tbody>
            </Table>
          </TableContainer>
          {dataOrderList?.length > 0 ? (
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
                list
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">Tidak ada data</div>
          )}
        </div>
        <div className="col-3 rounded shadow mt-3 p-3 filterbox">
          <div>Gudang</div>
          <div className="inputfilter">
            <Select
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="form-control form-control-lg mt-3
          "
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
              placeholder="Cari nama penerima"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inputfilter"></div>
          <div className="inputfilter">
          <Select
              onChange={(e) => setOrder(e.target.value)}
              className="form-control form-control-lg mt-3"
            >
              <option value={0}>Urutkan</option>
              <option value={1} selected={order == 1}>
                Nama Penerima: ASC
              </option>
              <option value={2} selected={order == 2}>
                Nama Penerima: DESC
              </option>
              <option value={3} selected={order == 3}>
                Status Transaksi: ASC
              </option>
              <option value={4} selected={order == 4}>
                Status Transaksi: DESC
              </option>
            </Select>
            <div className="inputfilter">
              <Select
                onChange={(e) => setStatus(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option value="">Filter Status Transaksi</option>
                <option value={2} selected={status == 2}>
                  Proses Pengecekan Pembayaran
                </option>
                <option value={3} selected={status == 3}>
                  Pembayaran Diterima
                </option>
                <option value={4} selected={status == 4}>
                  Diproses
                </option>
                <option value={5} selected={status == 5}>
                  Dikemas
                </option>
              </Select>
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
    </div>
  );
}

export default AdminOrderList;
