import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
  Input,
  Select,
  ButtonGroup,
} from "@chakra-ui/react";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function AdminWarehouse() {
  // STATE
  const [dataWarehouse, setDataWarehouse] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  // GET DATA
  const getWarehouse = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let warehouse = await Axios.post(
        API_URL + `/apis/warehouse/list`,
        { search, order, limit, page: parseInt(page) - 1 },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      setPage(warehouse.data.page + 1);
      setDataWarehouse(warehouse.data.data);
      setLastPage(warehouse.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (search != "" || order != 0) {
      setPage(1);
      setOnFilter(true);
      getWarehouse();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setOrder(0);
    setOnFilter(false);
  };

  //   USE EFFECT
  useEffect(() => {
    getWarehouse();
  }, [page, limit, onFilter]);

  //PRINT DATA
  const printData = () => {
    let data = dataWarehouse ? dataWarehouse : [];
    // let num = 0;
    return data.map((val, idx) => {
      let editpage = `/admin/editwarehouse?id_warehouse=${val.id_warehouse}`;
      if (val.status == 1 || val.status == 2) {
        // num++;
        let admin = "⚠️ NO ADMIN";
        if (val.status == 2) {
          admin = "✅ ACTIVE";
        } else {
          admin = "⚠️NO ADMIN";
        }
        return (
          <Tr>
            {/* <Td>{num}</Td> */}
            <Td>{val.warehouse_branch_name}</Td>
            <Td>{val.detail_address.substring(0, 30)}</Td>
            <Td>{admin}</Td>
            <Td>
              <Link to={editpage}>
                <Button
                  size="sm"
                  type="button"
                  colorScheme="orange"
                  variant="solid"
                >
                  Edit Gudang
                </Button>
              </Link>
            </Td>
          </Tr>
        );
      }
    });
  };

  return (
    <div className="paddingmain">
      <div>
        <Text fontSize="2xl">Pengelolaan Gudang </Text>
      </div>
      <div className="d-flex">
        <div className="col-9 rounded p-3 tablebox">
          <TableContainer className="rounded">
            <Table>
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">Cabang Gudang</Th>
                  <Th color="#ffffff">Alamat</Th>
                  <Th color="#ffffff">Admin</Th>
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
                placeholder="limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                style={{ width: "60px" }}
              />
              gudang
            </div>
          </div>
        </div>
        <div className="col-3 rounded shadow mt-3 p-3 filterbox">
          <div className="inputfilter">
            <div>Filter</div>
            <Input
              type="text"
              className="form-control mt-3"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
  );
}

export default AdminWarehouse;
