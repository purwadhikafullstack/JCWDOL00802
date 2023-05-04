import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import { format } from "date-fns";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Link,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import StockFilter from "../components/StockHistoryDetail/FilterStockHistory";
import TableDetailReport from "../components/StockHistoryDetail/StockTable";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function StockHistoryDetail() {
  const [salesData, setSalesData] = useState(null);
  const [dataExist, setDataExist] = useState(false);
  const [bulan, setBulan] = useState(0);
  const [namaBulan, setNamaBulan] = useState();
  const [tahun, setTahun] = useState();
  const [dataTahun, setDataTahun] = useState();
  const [selectedType,setSelectedType]=useState()
  const [dataWarehouse, setDataWarehouse] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [placebo, setPlacebo] = useState("search");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [type,setType]=useState([])
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };
  });

  const { id } = useParams();
  const getTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");

    
    Axios.post(
      `${API_URL}/apis/product/stockhistorydetail?page=${parseInt(page)-1}&limit=${limit}&id_product=${id}`,
      {
        bulan: bulan,
        tahun: tahun,
        type: selectedType,
        warehouse: selectedWarehouse,
      },
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    ).then((response) => {
      setSalesData(response.data.data);
      let type= response.data.stockType
      setType([{type: "allin",description : "semua-masuk"},{type: "allout",description : "semua-keluar"}, ...type])
      setTotalPage(response.data.total_page);
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
      setDataWarehouse(response.data);
      
    });
  };


  useEffect(() => {
    getWarehouse();
  }, [id_user]);
  useEffect(() => {
    getTransaction();
  }, [bulan, tahun, , selectedWarehouse, limit, page, id,selectedType]);

  
  const handleApplyFilter = (value)=>{
    
    setSelectedWarehouse(value.warehouseFilter)
    setSelectedType(value.selectedType)
    setTahun(value.selectedYear)
    setBulan(value.selectedMonth)
   
  }
  const handleLimit =(limit)=>{
    setPage(1)
    setLimit(limit)
  }
  return (
    <div className="row">
      <div className="col-7">
        <TableDetailReport data={salesData} />
        <div className="my-3"><PaginationOrder currentPage={parseInt(page)} totalPages={parseInt(totalPage)} onPageChange ={setPage} onLimitChange={handleLimit}/></div>
      </div>
      <div className="col-4 mx-2"><StockFilter handleFilter={handleApplyFilter} warehouses={dataWarehouse} type={type}/></div>
      
    </div>
  );
}

export default StockHistoryDetail;
