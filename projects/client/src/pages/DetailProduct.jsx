import React,{useEffect} from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../helper';
import Axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';

const DetailPage = (props) => {
    const navigate=useNavigate
    const [productData, setProductData] = React.useState({});
    const [cartData, setCartData] = React.useState(null);
    const [qty, setQty] = React.useState(0);
    const { id } = useParams();
   
   
        
    const { id_user , status} = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      status: state.userReducer.status,
    };})
    const getProductDetail = ()=>{
             Axios.get(`${API_URL}/apis/product/detail?id=${id}`).then((response)=>{setProductData(response.data)
            }).catch((error)=>{console.log(error)})           
    }


     useEffect(() => {
        getProductDetail()
    }, []);


    const getCartDetail = async ()=>{
            await Axios.get(`${API_URL}/apis/cart/detail/?id=${id_user}&prod=${id}`)
             .then((response)=>{setCartData(response.data)
              
            }).catch((error)=>{console.log(error)})    
    }
    useEffect(() => {
        getCartDetail()
    }, [id_user]);


    const onInc = () => {
        if (cartData == null){
        if (qty< parseInt(productData.stock)) {
            setQty(qty + 1)
        }
        if (qty == parseInt(productData.stock)){
            alert("sudah maksimal nih bos yang disini dibandingin dengan stock kita")
        }
        }else {
        let total = qty+ cartData.total_item
        
        if (total< parseInt(productData.stock)) {
            setQty(qty + 1)
        }
        if (total == parseInt(productData.stock)){
            alert("sudah maksimal nih bos yang disini ditambah yang dikeranjang bos dibandingin dengan stock kita")
        }}

    
    }

    const onDec = () => {
        if (qty > 1) {
            setQty(qty - 1)
        }
    }
    const addToCart =  ()=>{
        if (parseInt(productData.stock) == 0){
        alert ("stock kosong nih bos")
        }else if(qty == 0){
        alert ("jumlahnya masih 0, tolong isi dulu ya")
        }else if(status == 2 && parseInt(productData.stock)!== 0){
        let id_product = productData.id_product
        let total_item = qty
       Axios.post(API_URL+"/apis/cart/addtocart",{
        id_user,
        id_product,
        total_item
       }).then((res) => {
        alert(res.data.message);
        getCartDetail()
        setQty(0)
        
        if (res.data.success) {
          navigate("/cart");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(parseInt(productData.stock) == 0){
        alert ("stock abis bos")
    } else {
        navigate('/login', { replace: true })
    }

    
    }

    const checkTotal = ()=>{
        if(cartData == null){
            alert ("on cart = 0")
        } else
        alert(` on cart = ${cartData.total_item}`)
    }
    
   
    return <div className="container-xl">
                <div>
                    <div className="fs-1">nama:{productData.name}</div>
                    <div className="fs-2">harga:rp. {productData.price}</div>
                    <div className="fs-3">{productData.description}</div>           
                    <div>stock : {productData.stock}</div>
                    
                    <div className="fs-4">{qty}</div>
                    <div>
                    <button className="fs-4 btn btn-primary " onClick={onInc}>+</button>
                    <button className="fs-4 btn btn-primary" onClick={onDec}>-</button>
                    </div>
                    <button type="button" className="btn btn-danger" onClick={addToCart}>Add To Cart</button>
                    <div>status : {status}</div>
                    <button type="button" className="btn btn-danger" onClick={checkTotal}>check total item di keranjang </button>
                </div>
        
    </div>
    
}

export default DetailPage;