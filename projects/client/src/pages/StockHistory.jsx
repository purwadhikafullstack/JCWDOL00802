import {useSelector} from "react-redux"
import React,{useState,useEffect,} from "react"
import Axios  from "axios"
import { API_URL } from "../helper"
import {format} from "date-fns"
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
  } from '@chakra-ui/react'

function StockHistory() {

   const [salesData,setSalesData]= useState(null);
   const [dataExist,setDataExist]= useState(false)
   const [pendapatan,setPendapatan]= useState(0);
   const [pesanan,setPesanan]= useState(0);
   const [penjualan,setPenjualan]= useState(0)
   const [bulan,setBulan]= useState(0)
   const [namaBulan,setNamaBulan]= useState()
   const [tahun,setTahun]=useState()
   const [dataTahun,setDataTahun]=useState()
   const [dataCategory,setDataCategory]=useState()
   const [dataWarehouse,setDataWarehouse]=useState()
   const [selectedWarehouse,setSelectedWarehouse]= useState("")
   const [selectedCategory,setSelectedCategory]=useState("")
   const [search,setSearch]=useState("")
   const [placebo,setPlacebo]=useState("search")
   const [page,setPage]=useState(0)
   const [totalPage,setTotalPage]=useState(0)
   const [limit,setLimit]=useState(5)
   const [order,setOrder]=useState(["id_product","asc"])
   const {id_user,role} = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };})


    const getTransaction = async ()=>{
      let getLocalStorage = localStorage.getItem("cnc_login")
        const formattedBulan= parseInt(bulan)+1;
        const formattedTahun= parseInt(tahun)
        
        Axios.post(`${API_URL}/apis/product/stockhistory?page=${page}&limit=${limit}`,{
            bulan : formattedBulan,
            tahun : formattedTahun,
            search :search,
            warehouse : selectedWarehouse,
            category: selectedCategory,
            order: [order[0]]
            
            
        },
        {
          headers: {
      Authorization: `Bearer ${getLocalStorage}`,
    },
        })
        .then(
            (response)=>{
                setSalesData(response.data.data)
                
                setTotalPage(response.data.total_page)
                if(response.length>0){
                  setDataExist(true)
                } else{setDataExist(false)}
            }
        )
    }
    
    const getCategory = async ()=>{
      let getLocalStorage = localStorage.getItem("cnc_login")
      Axios.get(`${API_URL}/apis/product/category`)
      .then(
          (response)=>{
           
              setDataCategory(response.data)
          }
      )
    }
    const getWarehouse = async ()=>{
      let getLocalStorage = localStorage.getItem("cnc_login")
      Axios.get(`${API_URL}/apis/product/warehouse`,{
        headers: {
    Authorization: `Bearer ${getLocalStorage}`,
  },
      })
      .then(
          (response)=>{
            
              setDataWarehouse(response.data)
          }
      )
    }

    
    const setDefault =()=>{
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"]
        const month = new Date().getMonth()
        const year = new Date().getFullYear()
        const baseYear= 2022
        const dataYear =[]
        for(let i = parseInt(year); i >=baseYear; i--){
          dataYear.push(i)
        }
        setDataTahun(dataYear)
        setBulan(month)
        setNamaBulan(monthNames[month])
        setTahun(year)
    }

    const setMonth =(month)=>{
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"]
        setBulan(month)
        setNamaBulan(monthNames[month])
    }

    const printMonth =()=>{
        let data = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"]
        return data.map((val, idx) => {
            return <option value={idx} selected = {idx == bulan}>{val}</option>;
          });
    }
    const printYear =()=>{
      let data = dataTahun
      if (dataTahun){
      return data.map((val, idx) => {
          return <option value={val} selected = {val == tahun}>{val}</option>;
        });
      }
    }
    const printCategory =()=>{
      let data = dataCategory
      if (dataCategory){
      return data.map((val, idx) => {
          return <option value={val?.id_category} selected = {val.id_category == selectedCategory}>{val?.category}</option>;
        });
      }
    }
    const printWarehouse =()=>{
      let data = dataWarehouse
      if (dataWarehouse){
      return data.map((val, idx) => {
          return <option value={val?.id_warehouse} selected = {val.id_warehouse == selectedWarehouse}>{val?.warehouse_branch_name}</option>;
        });
      }
    }
    const printPage=()=>{
        let page=parseInt(totalPage)
        let data = []
        for (let i = 0; i < page; i++) {
            data.push((i+1))
            
        }
        return data.map((val,idx)=>{
            return <option value={val-1} selected = {val == (parseInt(page)+1)}>{val}</option>
        })
    }
    const printLimit=()=>{
        let data = [5,10,15,20]
        return data.map((val)=>{
            return <option value={val} selected={val == limit}>{val}</option>
        })
    }
    const printOrder=()=>{
        let data =[["id_product","asc"],["id_product","desc"],["name","asc"],["name","desc"]]
        return data.map((val)=>{
            return <option value={val} selected={val == order}>{val}</option>
        })
    }

    useEffect(() => {
        setDefault()
    }, []);
    useEffect(() => {
      getCategory()
  }, [id_user]);
  useEffect(() => {
    getWarehouse()
}, [id_user]);
    useEffect(() => {
        getTransaction()
    }, [bulan,tahun,selectedCategory,selectedWarehouse,search,limit,page,order]);
    

    const printData=()=>{
        let data = salesData
        if (salesData !== null){
        return data.map((val,idx)=>{
            let linkproduct= `/admin/stockhistory/${val.id_product}`
            
            return <Tr>
            <Td>
                <Link href= {linkproduct}>{val?.name}</Link>
            </Td>
            <Td isNumeric>{Math.abs(val?.out)}</Td>
            <Td isNumeric>{val?.In}</Td>
            <Td isNumeric>{val?.last}</Td>
          </Tr>
        })
    } 
    
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        
        setSearch(placebo);
      }
    }
    const handleChange = (event) => {
      setPlacebo(event.target.value);
    };



  return (
    <div>
      <input
        type="text"
        id="message"
        name="message"
        value={placebo}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
        <div className=" container" >
        <TableContainer>
  <Table variant='simple'>
    {
        !dataExist &&
    <TableCaption>tidak Ada Data</TableCaption>
    }
    <Thead>
      <Tr>
        <Th>Nama Produk</Th>
        <Th isNumeric>Stok Keluar</Th>
        <Th isNumeric>Stok Masuk</Th>
        <Th isNumeric>Stok Akhir</Th>
      </Tr>
    </Thead>
    <Tbody>
    {printData()}
    </Tbody>
    
  </Table>
</TableContainer>
        </div>

        
        <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Report di Bulan</label>
              <select
                onChange={(e)=>setMonth(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printMonth()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Tahun</label>
              <select
                onChange={(e)=>setTahun(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printYear()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Category</label>
              <select
                onChange={(e)=>setSelectedCategory(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option value="">all category</option>
                {printCategory()}
              </select>
              
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih warehouse</label>
              <select
                onChange={(e)=>setSelectedWarehouse(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
              {role == 3 &&
               <option value="">all warehouse</option>}
                {printWarehouse()}
              </select>
              
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Page</label>
              <select
                onChange={(e)=>setPage(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printPage()}
              </select>
            </div>
            
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih limit</label>
              <select
                onChange={(e)=>setLimit(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printLimit()}
              </select>
            </div>
            {/* <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih limit</label>
              <select
                onChange={(e)=>setOrder(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printOrder()}
              </select>
            </div> */}
    </div>
  )
}

export default StockHistory