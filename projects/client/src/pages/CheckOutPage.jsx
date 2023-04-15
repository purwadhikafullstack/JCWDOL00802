import {useDispatch, useSelector} from "react-redux"
import React,{useState,useEffect,componentDidMount} from "react"
import Axios  from "axios"
import { API_URL } from "../helper"
import { Text, NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,Button, ButtonGroup,Link,Box} from "@chakra-ui/react"
import { useNavigate,useParams  } from "react-router-dom"
import {format} from 'date-fns'


const CheckOut =(props) =>{
    
    const [cartData,setCartData] = useState(null)
    const [productData, setProductData] = React.useState(null);
    const [provinceData, setProvinceData] = useState(null)
    const [cityData, setCityData] = useState(null)
    const [total,setTotal] = useState (0)
    const [selectedAddress, setSelectedAddress]= useState(null)
    const [address,setAddress]=useState(null)
    const [selectedType,setSelectedType]= useState(null)
    const [shipment,setShipment]= useState(null)
    const [cost,setCost]=useState(0)
    const [pay,setPay]=useState(0)
    const [warehouseData,setWarehouseData]=useState(null)
    const [selectedWarehouse,setSelectedWarehouse]=useState(null)
    const [selectedOrigin, setSelectedOrigin]=useState (0)
    const [totalWeight,setTotalWeight]=useState(0)
    
    let getLocalStorage = localStorage.getItem("cnc_login") 


    const getCart = async ()=>{
           
            await Axios.get(`${API_URL}/apis/cart/selected`,{
              headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        }
            })
             .then((response)=>{setCartData(response.data)
              let totaWeight = 0
              for(let i =0; i<response.data.length ; i++){
                let added = response.data[i].Product.weight *response.data[i].total_item
                totaWeight += added
              }
              
              setTotalWeight(totaWeight)
              
              
            }).catch((error)=>{console.log(error)})    
    }
    const {id_user,status} = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      status: state.userReducer.status,
    };})


    


    const getSelectedAddress = async ()=>{
      const getData = await Axios.get(`${API_URL}/apis/address/detail`,{
              headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
            }).then((response)=>{
              setSelectedAddress(response)
        
      })
    }
    const getAddress = async ()=>{
      const getData = await Axios.get(`${API_URL}/apis/address/`,{
              headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
            }).then((response)=>{
        setAddress(response.data)      
        
      })
    }

    const getCost= async()=>{
      
      if(selectedAddress !== null && selectedOrigin !==0 && totalWeight !==0){
        let origin = selectedOrigin
        let destination = selectedAddress.data[0].key_city
        let courier = "jne"
        let weight = totalWeight
      let result = await Axios.post(`${API_URL}/apis/rajaongkir/ship`,{origin,destination,weight,courier}).then(
        (response)=>{
          
          setShipment(response.data.results[0].costs)
          setSelectedType(response.data.results[0].costs[0].service)
          setCost(response.data.results[0].costs[0].cost[0].value)
        }
      )
      }

    }
    
    const selectCourier = (service,price)=>{
      setSelectedType(service)
      setCost(price)
    }


    const selectAddress = async (id_address)=>{
      
      const getData = await Axios.post(`${API_URL}/apis/address/select`,{id_address},{
              headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
            })
      getAddress()
      getSelectedAddress()      
      console.log();
    }


    

    useEffect(()=>{
        getCost()
    },[selectedAddress,selectedOrigin,cartData,totalWeight])
    useEffect(()=>{
        getAddress()
    },[])
    
    useEffect(()=>{
        getSelectedAddress()
    },[])
    useEffect(()=>{
        getClosestWarehouse()
    },[selectedAddress])
    useEffect(() => {
        getCart()
    }, [id_user]);
    
    useEffect(() => {
        getTotalCost()
    }, [cartData]);
    useEffect(() => {
        getTotalPay()
    }, [total,cost]);
    


    const getTotalPay = ()=>{
      setPay(total+cost)
    }



    const getTotalCost= ()=>{
      let data =cartData
      let product = productData
      if(data !== null){
        let tempt = 0
        for(let i =0; i<data.length; i++){
          let totalPrice = data[i].total_item * data[i].Product.price
          tempt += totalPrice
          setTotal(tempt)
        }
      }
    }

    const getClosestWarehouse = async()=>{
      
      
      const getData =await Axios.get (`${API_URL}/apis/trans/warehouse`,{
        headers: {
    Authorization: `Bearer ${getLocalStorage}`,
  },
      })
       .then((response)=>{
        
        setSelectedOrigin(response.data.key_city)
       ;
      })
      
      
    }
    const getDate = async ()=>{
      
      let tanggal = format(new Date(), 'yyyy-MM-dd H:m:s')
      let add = selectedAddress.data[0].detail_address
      
      let result = await Axios.post(`${API_URL}/apis/trans/add`,{
        date: tanggal,
      shipment_fee: cost,
      shipment_service: `jne ${selectedType}`,
      total_price : total ,
      weight : totalWeight,
      address : selectedAddress.data[0].detail_address
      },{
              headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
            })
    }



    const printData =  () => {
        let data = cartData;
       
        if(cartData !== null){
        return data.map((val, idx) => {
           let totalPrice = val?.Product.price * val.total_item
           
            return <div className='mx-3 my-3'
                key={val.id_cart}>
                <div className='card shadow bg-primary m-auto text-center px-2 position-relative' style={{ width: '80%', top: '-45px' }}>
                    <Text fontSize="lg" className='text-white'>id product :{val?.id_product}</Text>
                    <Text fontSize="lg" className='text-white'>user :{val?.id_user}</Text>
                    <Text fontSize="lg" className='text-white'>nama product : {val?.Product.name}</Text>
                    <Text fontSize="lg" className='text-white'>harga : {val?.Product.price}</Text>
                    <Text fontSize="lg" className='text-white'>total item :{val?.total_item}</Text>
                    <Text fontSize="lg" className='text-white'>harga : {totalPrice}</Text>
                    
                    
                </div>
                
            </div>
        })}
    }

    const printAddress = () => {
      let data = address
      if (address != null){
      return data.map((val,idx)=>{
          if(val.priority == 1){
            return <Box bg='tomato' w='50%' p={4}  color='gray' my="1" borderRadius={25}>
              <Text fontSize="lg" className='text-white'>alamat :{val.detail_address}</Text>
              </Box>
          }else{
            return<Box bg='gray' w='50%' p={4} my="1" color='gray' borderRadius={25}>
  <Text fontSize="lg" className='text-black'>alamat :{val.detail_address}</Text>
<Button colorScheme='red' onClick={()=>selectAddress(val.id_address)}>select</Button>
</Box>
          }
      })}
    }
  const printService = () => {
      let data = shipment
      if (shipment != null){
      return data.map((val,idx)=>{
          if(val.service == selectedType){
            return <Box bg='tomato' w='50%' p={4} color='white'my="1" borderRadius={25}>
              <Text fontSize="lg" className='text-white'>service :{val.service}</Text>
              <Text fontSize="lg" className='text-white'>price :{val.cost[0].value}</Text>
              <Text fontSize="lg" className='text-white'>estimasi :{val.cost[0].etd} hari</Text>
              </Box>
          }else{
            return<Box bg='blue' w='50%' p={4} color='white'my="1" borderRadius={25}>
  <Text fontSize="lg" className='text-white'>service :{val.service}</Text>
  <Text fontSize="lg" className='text-white'>price :{val.cost[0].value}</Text>
  <Text fontSize="lg" className='text-white'>estimasi :{val.cost[0].etd}hari</Text>
<Button colorScheme='red' onClick={()=>selectCourier(val.service,val.cost[0].value)}>select</Button>
</Box>
          }
      })}
    }


 

    
    

    return  <div>
      <div className=" fs-3 mx-5"><strong>Checkout</strong></div>
      <div className="container-fluid">
          <div className="row">
            {/* bagian barang */}
            <div className="row col-8">
              <div className="py-3 w-100">{printAddress()} </div>
              
                  <div className="col-6 py-5">{printData()}</div>
                  <div className="col-6 py-2">{printService()}</div>
              
            </div>
            {/* bagian cost dll */}
            <div className=" col-auto border border-dark rounded">
                <div className="text-justify fs-5">shipment cost :  rp.{cost.toLocaleString()}</div>
                <div className="text-justify fs-5">total harga barang: rp.{total.toLocaleString()}</div>
                <div >total yang harus dibayar :rp.{pay.toLocaleString()}</div>
                {totalWeight >= 1000 &&
                  <div> berat total : {totalWeight/1000}kg</div>
                }
                {totalWeight < 1000 &&
                  <div> berat total : {totalWeight}gram</div>
                }
                <div className="text-center"><Link href="/transaction" ><Button colorScheme='red' onClick={()=>getDate()}>Bayar pesanan</Button></Link></div>
            </div>
          </div>
      </div>
    
    
    
    
   
    
    </div>
}

export default CheckOut