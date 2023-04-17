import {useDispatch, useSelector} from "react-redux"
import React,{useState,useEffect,componentDidMount} from "react"
import Axios  from "axios"
import { API_URL } from "../helper"
import { Text, NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,Button, ButtonGroup,Link} from "@chakra-ui/react"
import { useNavigate,useParams  } from "react-router-dom"



const Cart = (props) => {
  
  
  const userToken = localStorage.getItem("cnc_login")
 
  const [cartData, setCartData] = React.useState([]);
  const [dataExist,setDataExist]= useState(false)
  const [productData, setProductData] = React.useState(null);
  const [totalPrice,setTotalPrice]= useState(0)
  
  const getCart = async ()=>{
    
            await Axios.get(`${API_URL}/apis/cart/getcart`,{
              headers: {
          Authorization: `Bearer ${userToken}`,
        },
            })
             .then((response)=>{setCartData(response.data)
                
              
              if(response.length > 0){
                setDataExist(true)
              } else{setDataExist(false)}
              
              
            }).catch((error)=>{console.log(error)})    
    }


 

const {status} = useSelector((state) => {
    return {
      
      status: state.userReducer.status,
    };})
    
  useEffect(() => {
        getCart()
    }, []);
  useEffect(() => {
        unselectAll()
    }, []);
  useEffect(() => {
        getTotalPrice()
    }, [cartData]);

const onDec = async (arg,arg2)=>{
  let id_cart = arg
  if(arg2>1){
  await Axios.post(`${API_URL}/apis/cart/dec`,{id_cart}).then((response)=> 
  {getCart()
  }).catch((error)=>{console.log(error)})
  } else if (arg2 =1){
    delCart(arg)
  }
}
const onInc = async (id_cart,total_item,stock)=>{
  if (total_item < stock){
  
await Axios.post(`${API_URL}/apis/cart/inc`,{id_cart}).then((response)=> 
  {getCart()
  }).catch((error)=>{console.log(error)})}
  else if(total_item == stock){
    alert ("sudah max")
  }
}
const delCart= async (arg)=>{
let text = `apakah anda yakin akan menghapus ini?`
if (window.confirm(text)){
  
await Axios.delete(`${API_URL}/apis/cart/delete?id=${arg}`, ).then((response)=> 
  {alert(response.data.message)
      getCart()
  }).catch((error)=>{alert(error)})
}}

const selectAll = async ()=>{
  
  let result = await Axios.get(`${API_URL}/apis/cart/allcartselect`,{
              headers: {
          Authorization: `Bearer ${userToken}`,
        },
            })
  getCart()
}
const unselectAll = async ()=>{
  
  let result = await Axios.get(`${API_URL}/apis/cart/allcartunselect`,{
              headers: {
          Authorization: `Bearer ${userToken}`,
        },
            })
  getCart()
}

const getTotalPrice = ()=>{
  
  if(dataExist){
  let data = cartData.filter((e)=>{return e.selected == 1})
  let tempt = 0
  for (let i=0; i<data.length;i++){
    let priceHere= data[i].Product.price * data[i].total_item
    tempt += priceHere
    setTotalPrice(tempt)
  }
}
}

const onSelect = async (id_cart,checker) =>{
  try{
    if( checker == 0){
      let selector = await Axios.post(API_URL + `/apis/cart/updatecart`, { selected: "1", id_cart })
      getCart()
      
    }else{
    let selector = await Axios.post(API_URL + `/apis/cart/updatecart`, { selected: "0" , id_cart})
      getCart()
  } 
  } catch (error){console.log(error);}
}
    
    const printData = () => {
        let data =cartData
        
        
        return data.map((val, idx) => {
            if(val?.selected ==1){
              
              return <div className='col-12 col-sm-6 col-lg-4 '
                key={val.id_cart}>
                <div className='card shadow bg-success  my-2 mx-2 text-center px-2 ' style={{ width: '80%', top: '-45px' }}>
                    <input type="checkbox" checked={val?.selected == 1 ? true : false} defaultChecked={val?.selected}></input>
                    <Text fontSize="lg" className='text-white'>id product :{val?.id_product}</Text>
                    
                    <Text fontSize="lg" className='text-white'>user :{val?.id_user}</Text>
                    <Text fontSize="lg" className='text-white'>nama product : {val?.Product.name}</Text>
                    <Text fontSize="lg" className='text-white'>harga : {val?.Product.price}</Text>
                    <Text fontSize="lg" className='text-white'>total item :{val?.total_item}</Text>
                    
                    

                    <div>
                    <button className="fs-4 btn btn-warning " onClick={()=>onInc(val?.id_cart,val?.total_item, val?.Product.stock)} >+</button>
                    <button className="fs-4 btn btn-warning" onClick={()=>onDec(val?.id_cart,val?.total_item)}>-</button>
                    </div>
                    <Text fontSize="lg" className='text-white'>total harga : {val?.Product.price * val?.total_item}</Text>
                    <button type="button" className="btn btn-danger"  onClick={()=>delCart(val?.id_cart)} >Delete</button>
                    <button type="button" className="btn btn-danger"  onClick={()=>onSelect(val?.id_cart,val?.selected)} >unselect</button>
                    
                </div>
                
            </div>
            } else if(val?.selected == 0){
              return <div className='col-12 col-sm-6 col-lg-4 '
                key={val?.id_cart}>
                <div className='card shadow bg-primary my-2 mx-2  text-center px-2 ' style={{ width: '80%', top: '-45px' }}>
                    <input type="checkbox" checked={val?.selected == 1 ? true : false} defaultChecked={val?.selected}></input>
                    <Text fontSize="lg" className='text-white'>id product :{val?.id_product}</Text>
                    
                    <Text fontSize="lg" className='text-white'>user :{val?.id_user}</Text>
                    <Text fontSize="lg" className='text-white'>nama product : {val?.Product.name}</Text>
                    <Text fontSize="lg" className='text-white'>harga : {val?.Product.price}</Text>
                    <Text fontSize="lg" className='text-white'>total item :{val?.total_item}</Text>
                    
                    

                    <div>
                    <button className="fs-4 btn btn-warning " onClick={()=>onInc(val?.id_cart,val?.total_item, val?.Product.stock)} >+</button>
                    <button className="fs-4 btn btn-warning" onClick={()=>onDec(val?.id_cart,val?.total_item)}>-</button>
                    
                    </div>
                    <Text fontSize="lg" className='text-white'>total harga : {val?.Product.price * val?.total_item}</Text>
                    <button type="button" className="btn btn-danger"  onClick={()=>delCart(val?.id_cart)} >Delete</button>
                    <button type="button" className="btn btn-danger"  onClick={()=>onSelect(val?.id_cart,val?.selected)} >select</button>
                    
                </div>
                
            </div>
            }
        })
    }
   if(status == 2){
    return <div>
    {cartData.length >0 &&
    <div className="row p-3 mx-3 my-3">
      <div className="col-auto mx-1 my-1"><button type="button" className="btn btn-danger" onClick={()=>selectAll()}>selectAll</button></div>
      <div className="col-auto mx-1 my-1"><button type="button" className="btn btn-danger" onClick={()=>unselectAll()}>unselectAll</button></div>
    </div>
   }

    <div className="p-3 mx-3 my-2">
       {printData()}
    </div>
    
    <div>
      {totalPrice !== 0 &&
      <div>{totalPrice}</div>
      }
      {cartData.length> 0 &&
      <Link href ="/checkout"><button type="button" className="btn btn-danger">CheckOut</button></Link>
    }
    </div>
    
    
</div>} else{
  return <div>
    <a href="/">
    <div class="d-grid gap-2">
  <button className="btn btn-primary" type="button">Back To home </button>
  
</div></a>
  </div>
}
}
export default Cart