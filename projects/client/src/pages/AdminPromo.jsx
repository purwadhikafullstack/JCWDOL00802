import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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

function AdminPromo() {
  // STATE
  const [dataPromo, setDataPromo] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  let userToken = localStorage.getItem("cnc_login");
  let navigate = useNavigate();
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  // GET DATA
  const getPromo = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let promo = await Axios.post(
        API_URL + `/apis/promo/getpromolist`,
        { search, order, limit, page: parseInt(page) - 1, status },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      setPage(promo.data.page + 1);
      setDataPromo(promo.data.data);
      setLastPage(promo.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (search != "" || order != 0 || status != "") {
      setPage(1);
      setOnFilter(true);
      getPromo();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setOrder(0);
    setStatus("");
    setOnFilter(false);
  };

  //   USE EFFECT
  useEffect(() => {
    getPromo();
  }, [page, limit, onFilter]);

  //PRINT DATA
  const printData = () => {
    let data = dataPromo ? dataPromo : [];
    // let num = 0;
    return data.map((val, idx) => {
      let editpage = `/admin/editpromo?id_promo=${val.id_promo}`;
      let stat = "⚠️ INACTIVE";
      if (val.status == 1) {
        stat = "✅ ACTIVE";
      } else {
        stat = "⚠️INACTIVE";
      }
      return (
        <Tr>
          {/* <Td>{num}</Td> */}
          <Td>{val.promo_code}</Td>
          <Td>{val.description.substring(0, 30)}</Td>
          <Td>{stat}</Td>
          <Td>
            <Link to={editpage}>
              <Button
                size="sm"
                type="button"
                colorScheme="orange"
                variant="solid"
              >
                Edit Promo
              </Button>
            </Link>
          </Td>
        </Tr>
      );
    });
  };
  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Daftar Promo";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);
  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    } else if (role && role == 1) {
      navigate("/");
    } else if (role && role == 2) {
      navigate("/admin");
    }
  }, [role, userToken]);
  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
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
    <div className="paddingmain">
      <div>
        <Text fontSize="2xl">Pengelolaan Promo </Text>
      </div>
      <div className="d-flex">
        <div className="col-9 rounded p-3 tablebox">
          <TableContainer className="rounded">
            <Table>
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">Kode Promo</Th>
                  <Th color="#ffffff">Deskripsi</Th>
                  <Th color="#ffffff">Status</Th>
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
              promo
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
                Kode Promo:A-Z
              </option>
              <option value={2} selected={order == 2}>
                Kode Promo:Z-A
              </option>
              <option value={3} selected={order == 3}>
                Expired tercepat
              </option>
              <option value={4} selected={order == 4}>
                Expired terlama
              </option>
            </Select>
          </div>
          <div className="inputfilter">
            <Select
              onChange={(e) => setStatus(e.target.value)}
              className="form-control form-control-lg mt-3"
            >
              <option value={""} selected={status == 1}>
                Semua Status
              </option>
              <option value={1} selected={status == 1}>
                Aktif
              </option>
              <option value={0} selected={status == 2}>
                Tidak Aktif
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

export default AdminPromo;
