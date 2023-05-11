import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import { format } from "date-fns";
import {
  useToast
} from "@chakra-ui/react";
import SalesFilter from "../components/SalesReportComponent/SalesFilter";
import TableSalesReport from "../components/SalesReportComponent/salesTable";
import ReportSalesTop from "../components/SalesReportComponent/SalexBox";
import PaginationOrder from "../components/OrderComponent/OrderPagination";
import { useNavigate } from "react-router-dom";

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
  const [order, setOrder] = useState("asc");
  const [sort, setSort] = useState("name");
  const[isFirstPage,setIsFirtsPage]= useState(false)
  const [isLastPage, setIsLastPage]=useState(false)
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };
  });
  let data = [
    {label:"id",value:"id_product"},
    {value:"name",label:"nama"}
  ]
  let userToken = localStorage.getItem("cnc_login")
  const getTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    
    Axios.post(
      `${API_URL}/apis/product/sales?bulan=${bulan}&tahun=${tahun}&search=${search}&warehouse=${selectedWarehouse}&category=${selectedCategory}&limit=${limit}&page=${parseInt(page)-1}`,{
        bulan :bulan,
        tahun:tahun,
        search:search,
        warehouse:selectedWarehouse,
        category:selectedCategory,
        order: [sort,order]
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
  }, [bulan, tahun, selectedCategory, selectedWarehouse, search,order,sort]);

  const handleApplyFilter = (value)=>{
    setSelectedCategory(value.categoryFilter)
    setSelectedWarehouse(value.warehouseFilter) 
    setTahun(value.selectedYear)
    setBulan(value.selectedMonth)
    setSearch(value.searchTerm)
  }
  let navigate= useNavigate()
  let toast = useToast() 
  const toastMessage =(text,stat)=>{
    toast({
      title: text,
      status: stat,
      duration: 3000,
      isClosable: true,
      position:"top"
    })
  }
  useEffect(() => {
    let admin =[2,3]
   
    if(role && !admin.includes(role)){
      navigate("/")
      toastMessage("unAuthorized Access", "error")
    }
    if (!userToken){
      navigate("/login")
      toastMessage("Please Login First", "error")
    }
  }, [role,userToken])
  const handleLimit =(limit)=>{
    setPage(1)
    setLimit(limit)
  }
  return (
    <div className="container row ">
      <div className="col-9 my-4">
        <div className="my-3"><ReportSalesTop pendapatan={pendapatan} total_barang={penjualan} total_pesanan={pesanan} /></div>
        <TableSalesReport data={salesData} />
        <div className="my-3"><PaginationOrder currentPage={parseInt(page)} totalPages={parseInt(totalPage)} onPageChange ={setPage} maxLimit={15} onLimitChange={handleLimit} /></div>
      </div>
      <div className="col-3"><SalesFilter warehouses={dataWarehouse} categories={dataCategory} handleFilter={handleApplyFilter} setOrder={setOrder} setSort={setSort} selectedOrder={order} selectedSort={sort} Sort={data}/>
      
      </div>
    </div>
  );
}

export default ReportSales;
