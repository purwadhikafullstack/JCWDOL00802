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
import SalesFilter from "../components/SalesReportComponent/SalesFilter";
import TableSalesReport from "../components/SalesReportComponent/salesTable";
import ReportSalesTop from "../components/SalesReportComponent/SalexBox";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function ReportSales() {
  const [salesData, setSalesData] = useState(null);
  const [dataExist, setDataExist] = useState(false);
  const [pendapatan, setPendapatan] = useState(0);
  const [pesanan, setPesanan] = useState(0);
  const [penjualan, setPenjualan] = useState(0);
  const [bulan, setBulan] = useState("");
  const [namaBulan, setNamaBulan] = useState();
  const [tahun, setTahun] = useState("");
  const [dataTahun, setDataTahun] = useState();
  const [dataCategory, setDataCategory] = useState();
  const [dataWarehouse, setDataWarehouse] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [placebo, setPlacebo] = useState("search");
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage]=useState(0)
  const [limit,setLimit]=useState(5)
  const[isFirstPage,setIsFirtsPage]= useState(false)
  const [isLastPage, setIsLastPage]=useState(false)
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };
  });

  const getTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    
    Axios.post(
      `${API_URL}/apis/product/sales?bulan=${bulan}&tahun=${tahun}&search=${search}&warehouse=${selectedWarehouse}&category=${selectedCategory}&limit=${limit}&page=${parseInt(page)-1}`,{
        bulan :bulan,
        tahun:tahun,
        search:search,
        warehouse:selectedWarehouse,
        category:selectedCategory
      },
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    ).then((response) => {
      setSalesData(response.data.result);
      setPendapatan(response.data.total_biaya)
      setPenjualan(response.data.jumlah)
      setPesanan(response.data.total_pesanan)
      setTotalPage(response.data.total_page)
      if (response.data.length > 0) {
        setDataExist(true);
      } else {
        setDataExist(false);
      }
    });
  };

  const getCategory = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
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
    getCategory();
  }, [id_user]);
  useEffect(() => {
    getWarehouse();
  }, [id_user]);
  useEffect(() => {
    getTransaction();
  }, [bulan, tahun, selectedCategory, selectedWarehouse, search]);

  const handleApplyFilter = (value)=>{
    setSelectedCategory(value.categoryFilter)
    setSelectedWarehouse(value.warehouseFilter) 
    setTahun(value.selectedYear)
    setBulan(value.selectedMonth)
    setSearch(value.searchTerm)
  }
  useEffect(() => {
    if(page === 1){
        setIsFirtsPage(true)
    }else{setIsFirtsPage(false)}
  if (page === totalPage){
    setIsLastPage(true)
  }else{setIsLastPage(false)}
  }, [salesData])
  const handleLimit =(limit)=>{
    setPage(1)
    setLimit(limit)
  }
  return (
    <div className="container row ">
      <div className="col-9 my-4">
        <div className="my-3"><ReportSalesTop pendapatan={pendapatan} total_barang={penjualan} total_pesanan={pesanan} /></div>
        <TableSalesReport data={salesData} />
        <div className="my-3"><PaginationOrder currentPage={parseInt(page)} totalPages={parseInt(totalPage)} onPageChange ={setPage} maxLimit={15} onLimitChange={handleLimit}/></div>
      </div>
      <div className="col-3"><SalesFilter warehouses={dataWarehouse} categories={dataCategory} handleFilter={handleApplyFilter}/></div>
    </div>
  );
}

export default ReportSales;
