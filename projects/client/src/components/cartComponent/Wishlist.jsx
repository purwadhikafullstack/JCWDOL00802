import React from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Spacer,
  IconButton,useToast
} from '@chakra-ui/react';
import { FaTrash,FaCartPlus } from 'react-icons/fa';
import { API_URL } from '../../helper';
import Axios from "axios";



const Wishlist = ({
  wishlist,getData,getCart
  
}) => {
  const userToken=localStorage.getItem("cnc_login")
    
    const toast=useToast()
  const printData = () => {
    let data = wishlist;
    
    if(wishlist){
    return <Flex flexWrap="wrap" >
    {data.map((val, idx) => {
      let image = `${API_URL}/img/product/${val.Product.product_picture}`;
      return (
        <Box
          key={val?.id_cart}
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
          m={2}
          boxShadow="sm"
          width={{ base: "45%" }}
        >
          <Flex alignItems="center">
          
            <Image
              src={image}
              alt={val?.Product.name}
              objectFit="cover"
              height="8rem"
              width="8rem"
            />
            <Box p={4}>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {val?.Product.name.substring(15,0)}
              </Text>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Rp{val?.Product.price.toLocaleString()},-
              </Text>
            </Box>
            <Spacer />
            <Box display="flex" alignItems="center" pr={4}>
              <IconButton
                aria-label="delete"
                icon={<FaTrash />}
                colorScheme="orange"
                isRound
                size="sm"
                mr={3}
                onClick={()=>{removeWishlist(val.id_product)}}
                
              />
              <IconButton
                aria-label="delete"
                icon={<FaCartPlus />}
                colorScheme="orange"
                isRound
                size="sm"
                onClick={()=>{addToCart(val.id_wishlist)}}
              />
            </Box>
          </Flex>
        </Box>
      );
    })}</Flex>}
  };
  const addToCart = async(id)=>{
    try {
        let add = await Axios.post(`${API_URL}/apis/wishlist/cart?id=${id}`,{},{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          toastMessage(add.data.message,"success")
          getCart()
    } catch (error) {
        toastMessage(error.response.data.message,"error");
    }
}
const removeWishlist = async (id)=>{
    try {
      let remove = await Axios.delete(`${API_URL}/apis/wishlist/wish?id=${id}`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      ;
      toastMessage(remove.data.message,"success")
      getData()
      
    } catch (error) {
      
    }
  }
  const toastMessage=(text,stat)=>{
    toast({
      title: text,
      status: stat,
      duration: 3000,
      isClosable: true,
      position:"top"
    })
    
  }
  return (
    printData()
  );
};

export default Wishlist;