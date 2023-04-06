import {useDispatch, useSelector} from "react-redux"
import React,{useState,useEffect,componentDidMount} from "react"
import Axios  from "axios"
import { API_URL } from "../helper"
import { Text,Button,Link,Card,  CardBody, CardFooter,
  Stack,Image,Heading,Spacer,useDisclosure} from "@chakra-ui/react"
import {format} from 'date-fns'
import { CgProfile } from "react-icons/cg"
import DetailTrans from "../components/DetailTransaksi"

const OrderPage = (props) => {
const [orderData,setOrderData]=useState(null)
const [statusData,setStatusData]= useState(null)
const [dataSelected,setDataSelected]= useState()
const { isOpen, onOpen, onClose } = useDisclosure()

// const {data:orderDataNew,getOrder:refetchOrder}=useGetOrder()
// const {data:test}=useGetTest()
// console.log("nama",test);

 const {id_user,username} = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      username: state.userReducer.username,
    };})

const getOrder = async ()=>{
    let getLocalStorage = localStorage.getItem("cnc_login")
            await Axios.get(`${API_URL}/apis/trans/list`,{
              headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
            })
             .then((response)=>{setOrderData(response.data)
              
              
            }).catch((error)=>{console.log(error)})    
    }




useEffect(() => {
        getOrder()
    }, []);

const menunggu = ()=>{
  let data = orderData.filter((e)=>{return e.transaction_status == 1}
  )
  setOrderData(data)
}




const PrintOrder = ()=>{
let data = orderData
    if (data !== null){
        return data.map((val,idx)=>{
          let gambar = `http://localhost:3600/img/product/${val.Transaction_Details[0].Product.product_picture}.jpg`
          return <div className ="" key={val.id_transaction}>
              <div className="row">
              <div className="col-1 fs-6 pe-1"><strong>Belanja</strong></div>
              <div className="col-auto fs-6">{format(new Date(val.date), 'yyyy-MM-dd h:m a')}</div>
              {val.transaction_status <9 &&
                <div className="col-auto fs-6 px-1 border rounded text-center bg-success text-white">{val.Transaction_status.description}</div>
              }
              {val.transaction_status ==9 &&
                <div className="col-auto fs-6 px-1 border rounded text-center bg-danger text-white">{val.Transaction_status.description}</div>
              }
              </div>
              <div>
                  <div className="my-2">
                    <Card
                      direction={{ base: 'column', sm: 'row' }}
                      overflow='hidden'
                      variant='outline'
>
                    <Image
                      objectFit='cover'
                      maxW={{ base: '100%', sm: '200px' }}
                      src= {gambar}
                      alt={val.Transaction_Details[0].Product.name}
                    />

                    <Stack>
                      <CardBody>
                        <Heading size='md'>{val.Transaction_Details[0].Product.name}</Heading>

                        <Text py='2'>
                          {val.Transaction_Details[0].total_item} x Rp. {val.Transaction_Details[0].purchased_price.toLocaleString()}
                        </Text>
                      { (val.Transaction_Details.length -1) >0 &&
                        <Text py='2'>
                          {val.Transaction_Details.length -1} barang lainnya 
                        </Text>
                      }
                      </CardBody>

                      <CardFooter >
                        
                        <Text>
                          Total Belanja : Rp. {(val.total_price + val.shipment_fee).toLocaleString()}
                        </Text>
                        <Spacer/>
                        <Button variant='solid' colorScheme='orange'mx="1" onClick={()=>{onOpen(); setDataSelected(val)}}>
                          check detail
                        </Button>
                        { val.transaction_status == 1 &&
                        <div>
                        <Button variant='solid' colorScheme='orange' mx="1" >
                          cancel
                        </Button>
                        <Button variant='solid' mx="1" colorScheme='orange'>
                          upload bukti
                        </Button>
                          </div>
                        }
                        {val.transaction_status == 8 &&
                        <Button variant='solid' mx="1" colorScheme='orange'>
                          halaman komplain
                        </Button>
                        }
                        {val.transaction_status == 6 &&
                        <div>
                          <Button variant='solid' mx="1" colorScheme='orange'>
                          terima pesanan
                        </Button>
                        <Button variant='solid' mx="1" colorScheme='orange'>
                          ajukan komplain
                        </Button>
                        </div>
                        }
                        
                      </CardFooter>
                    </Stack>
                    </Card>
                  </div>

          </div>
          </div>




        })
    }
}





return <div className="container-fluid pt-3 ">
  
  <div className="row">
      {/* side bar kanan */}
      <div className="col-2">
            <div className="row border border-top-0 border-start-0 border-end-0 border-primary mx-2">
                <div className="col-1"><CgProfile/></div>
                <div className="col-4">{username}</div>
            </div>
            <div className="mx-2 mt-2">
              <div className="accordion mt-16px ">
                  <div className="accordion-item ">
                      <h4 className="accordion-header" >
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          <strong colorScheme="orange">Pembelian</strong>
                        </button>
                      </h4>
                      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body ">
                            <Link href ="/order/"><div className="">Daftar Transaksi</div></Link>
                            <div className="" onClick={()=>menunggu()}>Menunggu pembayaran</div>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <div className=" mt-2 mx-2">
              <div className="accordion mt-16px ">
                  <div className="accordion-item ">
                      <h4 className="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                          <strong>Profile</strong>
                        </button>
                      </h4>
                      <div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div class="accordion-body ">
                            <Link href ="/cart/"><div className="">Halaman Profile</div></Link>
                            <Link href ="/wishlist/"><div className="">Wishlist</div></Link>
                            <Link href ="/cart/"><div className="">Keranjang Belanja</div></Link>
                        </div>
                      </div>
                  </div>
              </div>
            </div>

      </div>
        {/* side tengah */}
      <div className ="col-8  mx-1 pb-2">
          <h1 className="ms-2 mt-2 fs-2"><strong>Daftar Transaksi</strong></h1>
          <div className=" ms-4 mt-2">
              {orderData !== null &&
              <div className="row">
                  <div></div>
                  
                 {PrintOrder()}
                  
              </div>}
          </div>
      </div>

      {/* side kiri */}
      <div className="col mx-1"></div>

  </div>

{/* <button type="button" className="btn btn-danger" onClick={()=>checkresponse()} >check</button> */}
<DetailTrans isOpen={isOpen} onClose={onClose} data={dataSelected}/>
</div>
}

export default OrderPage