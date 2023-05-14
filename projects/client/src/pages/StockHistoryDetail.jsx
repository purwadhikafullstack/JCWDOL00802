import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import { format } from "date-fns";
import { Box, Image, Text, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import StockFilter from "../components/StockHistoryDetail/FilterStockHistory";
import TableDetailReport from "../components/StockHistoryDetail/StockTable";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function StockHistoryDetail() {
  const [salesData, setSalesData] = useState(null);
  const [dataExist, setDataExist] = useState(false);
  const [bulan, setBulan] = useState(0);
  const [tahun, setTahun] = useState();
  const [selectedType, setSelectedType] = useState();
  const [dataWarehouse, setDataWarehouse] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [type, setType] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productChecker, setProductChecker] = useState([]);
  const [order, setOrder] = useState("asc");
  const [sort, setSort] = useState("date");
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };
  });
  let userToken = localStorage.getItem("cnc_login");
  const navigate = useNavigate();
  const { id } = useParams();
  const getTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");

    Axios.post(
      `${API_URL}/apis/product/stockhistorydetail?page=${
        parseInt(page) - 1
      }&limit=${limit}&id_product=${id}`,
      {
        bulan: bulan,
        tahun: tahun,
        type: selectedType,
        warehouse: selectedWarehouse,
        order: [sort, order],
      },
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    ).then((response) => {
      setSalesData(response.data.data);
      let type = response.data.stockType;
      setType([
        { type: "", description: "semua jenis" },
        { type: "allin", description: "semua-masuk" },
        { type: "allout", description: "semua-keluar" },
        ...type,
      ]);
      setTotalPage(response.data.total_page);
      setProductData(response.data.productInfo);
      if (!response.data.productInfo.id_product) {
        setProductChecker(null);
      } else {
        setProductChecker(["1"]);
      }
      if (response.data.data.length > 0) {
        setDataExist(true);
      } else {
        setDataExist(false);
      }
    });
  };

  const getWarehouse = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehouse`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      if (response.data.length == 1) {
        setDataWarehouse(response.data);
      } else if (response.data.length > 1) {
        let data = response.data;
        setDataWarehouse([
          { warehouse_branch_name: "Semua Gudang", id_warehouse: "" },
          ...data,
        ]);
      }
    });
  };
  let toast = useToast();
  const toastMessage = (text, stat) => {
    toast({
      title: text,
      status: stat,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };
  useEffect(() => {
    let admin = [2, 3];
    if (!productChecker) {
      navigate("/admin/stockhistory");
      toastMessage("there is no product with that link", "error");
    }
    if (role && !admin.includes(role)) {
      navigate("/");
      toastMessage("unAuthorized Access", "error");
    }
    if (!userToken) {
      navigate("/login");
      toastMessage("Please Login First", "error");
    }
  }, [productChecker, role, userToken]);

  useEffect(() => {
    getWarehouse();
  }, [id_user]);
  useEffect(() => {
    getTransaction();
  }, [
    bulan,
    tahun,
    ,
    selectedWarehouse,
    limit,
    page,
    id,
    selectedType,
    order,
    sort,
  ]);

  const handleApplyFilter = (value) => {
    setSelectedWarehouse(value.warehouseFilter);
    setSelectedType(value.selectedType);
    setTahun(value.selectedYear);
    setBulan(value.selectedMonth);
  };
  const handleLimit = (limit) => {
    setPage(1);
    setLimit(limit);
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Stock History Detail";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };

  return (
    <div className="row">
      <div className="col-7">
        <div className="mx-3 p-1">
          <Box
            display="flex"
            alignItems="center"
            boxShadow="lg"
            borderRadius="md"
            p={4}
            className="border rounded p-4"
          >
            <Image
              src={`${API_URL}/img/product/${productData.product_picture}`}
              alt={productData?.name}
              width={120}
              mr={4}
              className="rounded"
            />
            <Box>
              <Text fontWeight="bold">{productData?.name}</Text>
              <Text fontSize="sm">Stock: {productData?.stock}</Text>
            </Box>
          </Box>
        </div>
        <TableDetailReport data={salesData} />
        <div className="my-3">
          {salesData && (
            <PaginationOrder
              currentPage={parseInt(page)}
              totalPages={parseInt(totalPage)}
              onPageChange={setPage}
              onLimitChange={handleLimit}
            />
          )}
        </div>
      </div>
      <div className="col-4 mx-2">
        <StockFilter
          handleFilter={handleApplyFilter}
          warehouses={dataWarehouse}
          type={type}
          setOrder={setOrder}
          setSort={setSort}
          selectedOrder={order}
          selectedSort={sort}
        />
      </div>
    </div>
  );
}

export default StockHistoryDetail;
