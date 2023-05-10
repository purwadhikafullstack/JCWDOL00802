import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, componentDidMount } from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import {
  Text,
  Button,
  Link,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Image,
  Heading,
  Spacer,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { format } from "date-fns";
import { CgProfile } from "react-icons/cg";
import DetailTrans from "../components/DetailTransaksi";
import FilterOrderList from "../components/OrderComponent/FilterOrderComponent";
import PaginationOrder from "../components/OrderComponent/OrderPagination";
import SidebarOrder from "../components/OrderComponent/SidebarOrderComponent";
import { useNavigate } from "react-router-dom"

const OrderPage = (props) => {
  const [orderData, setOrderData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [dataSelected, setDataSelected] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page,setPage] = useState(1)
  const[totalPage,setTotalPage]= useState(0)
  const[isFirstPage,setIsFirtsPage]= useState(false)
  const [isLastPage, setIsLastPage]=useState(false)
  const [limit,Setlimit]=useState(5)
  const [month,setMonth]=useState("")
  const [year,setYear]= useState("")
  const [search,setSearch]=useState("")
  const [status,setStatus]=useState ("")
  const [pageNumber,setPageNumber]=useState([])
  let toast = useToast() 
  let userToken =localStorage.getItem("cnc_login")
  let navigate=useNavigate()
  
  
  const { id_user, username,role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      username: state.userReducer.username,
      role: state.userReducer.role
    };
  });

  const getOrder = async () => {
    
    await Axios.post(`${API_URL}/apis/trans/list?limit=${limit}&page=${page-1}`,{
      month : month,
      year : year,
      search : search,
      status: status

    }, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        setTotalPage(response.data.total_page)
    
        setOrderData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let changeStatus = async(id,stat)=>{
    let text = ""
    if (stat==9){
      text = `apakah anda yakin ingin membatalkan pesanan?`
      
    }
    if (stat==7){
      let text = `apakah anda yakin ingin menerima pesanan?`
      
    }
    if (stat==8){
      let text = `apakah anda yakin ingin mengajukan komplain pesanan?`
      
    }
    if (window.confirm (text)){
    const change = await Axios.get(`${API_URL}/apis/trans/changestatus?id=${id}&stat=${stat}`,{
              headers: {
          Authorization: `Bearer ${userToken}`,
        },
            })
           
    toastMessage(change.data.message)
    getOrder()
          }
}

  useEffect(() => {
    getOrder();
  }, [year,month,page,limit,status,]);
  useEffect(() => {
    document.title = "Cnc || Pesanan";
    window.addEventListener('beforeunload', resetPageTitle);
    return () => {
      window.removeEventListener('beforeunload', resetPageTitle());
    }
  }, []);
  const toastMessage =(text)=>{
    toast({
      title: text,
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position:"top"
    })
  }
  const messageAuthorize =()=>{
    if(!userToken){
    toast({
      title: 'Silahkan login dulu',
      status: 'error',
      duration: 3000,
      isClosable: true,
      position:"top"
    })}else if(role && role !== 1){
      toast({
        title: 'Admin tidak bisa mengakses ini!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:"top"
      })}
  }
  useEffect(() => {
    if(!userToken){
      
      navigate("/login")
    }else if(role && role !== 1){
      
      navigate("/")}
      messageAuthorize()
      if(status && status == 1){
        navigate("/")
      }
  }, [role,userToken,status] )
  const resetPageTitle = () => {
    
    document.title = "Cnc-ecommerce";
  }

  const handleMonthFilter = (event) => {
    setMonth(event.target.value);
    if(year !=="" && typeof year !== "undefined" ){
      setPage(1)
    }
    ;
  };
  const handleYearFilter = (event) => {
    setYear(event.target.value);
    if(month !=="" && typeof month !== "undefined" ){
      setPage(1)
    }
  };
  const handleSearch = (event) => {
    setPage(1)
    getOrder()
  }
  const handleKey = (event) => {
    if (event.key === 'Enter') {
      setPage(1)
      getOrder()
    }
  }
  const handleLimit =(limit)=>{
    setPage(1)
    Setlimit(limit)
  }
  const handleStatus = (status)=>{
    setPage(1)
    setStatus(status)
  }
  const handleWaiting = (e)=>{
    setPage(1)
    setStatus("waiting")
    
  }
  
  
  const PrintOrder = () => {
    let data = orderData;
    if (data !== null) {
      return data.map((val, idx) => {
        let gambar = `${API_URL}/img/product/${val.Transaction_Details[0].Product.product_picture}`;
        return (
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded" key={val.id_transaction}>
            <div className="row">
              <div className="col-1 fs-6 pe-1">
                <strong>Belanja</strong>
              </div>
              <div className="col-auto fs-6">
                {format(new Date(val.date), "yyyy-MM-dd hh:mm a")}
              </div>
              {val.transaction_status < 9 && (
                <div className="col-auto fs-6 px-1 border rounded text-center bg-success text-white">
                  {val.Transaction_status.description}
                </div>
              )}
              {val.transaction_status == 9 && (
                <div className="col-auto fs-6 px-1 border rounded text-center bg-danger text-white">
                  {val.Transaction_status.description}
                </div>
              )}
            </div>
            <div>
              <div className="my-2">
                <Card
                  direction={{ base: "column", sm: "row" }}
                  overflow="hidden"
                  variant="outline"
                >
                  <Image
                    objectFit="cover"
                    maxW={{ base: "100%", sm: "200px" }}
                    src={gambar}
                    alt={val.Transaction_Details[0].Product.name}
                  />

                  <Stack>
                    <CardBody>
                      <Heading size="md">
                        {val.Transaction_Details[0].Product.name}
                      </Heading>

                      <Text py="2">
                        {val.Transaction_Details[0].total_item} x Rp.{" "}
                        {val.Transaction_Details[0].purchased_price.toLocaleString()}
                      </Text>
                      {parseInt(val.number_item)-1 > 0 && (
                        <Text py="2">
                          {val.number_item - 1} barang lainnya
                        </Text>
                      )}
                    </CardBody>

                    <CardFooter>
                      <Text>
                        Total Belanja : Rp.{" "}
                        {(val.total_price + val.shipment_fee).toLocaleString()}
                      </Text>
                      <Spacer />
                      <div className="position-absolute  end-0">
                      <Button
                        variant="solid"
                        colorScheme="orange"
                        mx="1"
                        onClick={() => {
                          onOpen();
                          setDataSelected(val);
                        }}
                      >
                        check detail
                      </Button>
                      {val.transaction_status == 1 && (
                          <>
                          <Button variant="solid" colorScheme="orange" mx="1"onClick={()=>changeStatus(val.id_transaction,9)}>
                            cancel
                          </Button>
                          <Button variant="solid" mx="1" colorScheme="orange">
                            upload bukti
                          </Button>
                        </>
                      )}
                      {val.transaction_status == 8 && (
                        <Button variant="solid" mx="1" colorScheme="orange">
                          halaman komplain
                        </Button>
                      )}
                      {val.transaction_status == 6 && (
                        <>
                          <Button variant="solid" mx="1" colorScheme="orange"onClick={()=>changeStatus(val.id_transaction,7)}>
                            terima pesanan
                          </Button>
                          <Button variant="solid" mx="1" colorScheme="orange"onClick={()=>changeStatus(val.id_transaction,8)}>
                            ajukan komplain
                          </Button>
                        </>
                      )}</div>
                    </CardFooter>
                  </Stack>
                </Card>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  return (
    <div className="container-fluid pt-3 px-3 ">
      <div className="row">
        {/* side bar kiri */}
        
        <div className="col-3 row">
          <div className=" col-3 position-fixed start-2">
      <SidebarOrder onWaitClick={handleWaiting} /></div>
    </div>
        {/* side tengah */}
        <div className="col-8  position-relative mx-2 pb-2 start-2">
          <h1 className="ms-2 mt-2 fs-2">
            <strong>Daftar Transaksi</strong>
          </h1>
          <FilterOrderList data={orderData} statusFilter={status} handleStatusFilter={handleStatus} monthFilter={month} yearFilter={year} handleMonthFilter={handleMonthFilter} handleYearFilter={handleYearFilter} handleSearch={handleSearch} setSearchText={setSearch} searchText={search} handleKey={handleKey}/>
          <div className=" ms-4 mt-2">
            {orderData !== null && (
              <div className="row">
                <div></div>

                {PrintOrder()}
              </div>
            )}
          </div>
          
          <PaginationOrder  currentPage={parseInt(page)} totalPages={parseInt(totalPage)} onPageChange ={setPage} maxLimit={30} onLimitChange={handleLimit}/>
        </div>

        {/* side kanan*/}
        <div className="col-2 mx-1"></div>
      </div>

      {/* <button type="button" className="btn btn-danger" onClick={()=>checkresponse()} >check</button> */}
      <DetailTrans isOpen={isOpen} onClose={onClose} data={dataSelected} />
    </div>
  );
};

export default OrderPage;
