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
  Link,useToast
} from "@chakra-ui/react";
import SalesFilter from "../components/SalesReportComponent/SalesFilter";
import StockHistoryTable from "../components/StockHistory.jsx/StockHistoryTable";
import PaginationOrder from "../components/OrderComponent/OrderPagination";
import { useNavigate } from "react-router-dom";

function StockHistory() {
  const [salesData, setSalesData] = useState(null);
  const [dataExist, setDataExist] = useState(false);
  const [pendapatan, setPendapatan] = useState(0);
  const [pesanan, setPesanan] = useState(0);
  const [penjualan, setPenjualan] = useState(0);
  const [bulan, setBulan] = useState(0);
  const [namaBulan, setNamaBulan] = useState();
  const [tahun, setTahun] = useState();
  const [dataTahun, setDataTahun] = useState();
  const [dataCategory, setDataCategory] = useState();
  const [dataWarehouse, setDataWarehouse] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [placebo, setPlacebo] = useState("search");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [order, setOrder] = useState("asc");
  const [sort, setSort] = useState("id_product");
  const[isFirstPage,setIsFirtsPage]= useState(false)
  const [isLastPage, setIsLastPage]=useState(false)

  let sortData = [
    {label:"id",value:"id_product"},
    {value:"name",label:"nama"}
  ]
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };
  });
  let userToken= localStorage.getItem("cnc_login")
  const getTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    const formattedBulan = parseInt(bulan) + 1;
    const formattedTahun = parseInt(tahun);

    Axios.post(
      `${API_URL}/apis/product/stockhistory?page=${parseInt(page)-1}&limit=${limit}`,
      {
        bulan: bulan,
        tahun: tahun,
        search: search,
        warehouse: selectedWarehouse,
        category: selectedCategory,
        order:[sort,order]
        
      },
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    ).then((response) => {
      setSalesData(response.data.data);

      setTotalPage(response.data.total_page);
      if (response.length > 0) {
        setDataExist(true);
      } else {
        setDataExist(false);
      }
    });
  };
  const handleLimit =(limit)=>{
    setPage(1)
    setLimit(limit)
  }
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
      if(response.data.length == 1){
        setDataWarehouse(response.data);}else if(response.data.length > 1){
          let data = response.data
          setDataWarehouse([{warehouse_branch_name: "Semua Gudang", id_warehouse :""},...data])
        }
    });
  };


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


  
  
  
    
  


  useEffect(() => {
    getCategory();
  }, [id_user]);
  useEffect(() => {
    getWarehouse();
  }, [id_user]);
  useEffect(() => {
    getTransaction();
  }, [
    bulan,
    tahun,
    selectedCategory,
    selectedWarehouse,
    search,
    limit,
    page,
    order,
    sort
  ]);

  const handleApplyFilter = (value)=>{
    setSelectedCategory(value.categoryFilter)
    setSelectedWarehouse(value.warehouseFilter)
    setTahun(value.selectedYear)
    setBulan(value.selectedMonth)
    setPage(1)
  }  
 
  return (
    <div className="container row my-4">
        <div className ="col-8 mx-1">
          <div className="my-3">
          <StockHistoryTable data={salesData}/>
          </div>
          <div>
          <PaginationOrder  currentPage={parseInt(page)} totalPages={parseInt(totalPage)} onPageChange ={setPage} onLimitChange={handleLimit} maxLimit={15}/>
          </div>
        </div>
        <div className="col-3 my-3 ">
          <div >
            <SalesFilter warehouses={dataWarehouse} categories={dataCategory} handleFilter={handleApplyFilter} setOrder={setOrder} setSort={setSort} selectedOrder={order} selectedSort={sort} Sort={sortData}/>
          </div>
          
      </div>
      
    </div>
  );
}

export default StockHistory;
