import Axios from "axios";
import { API_URL } from "../helper";
import { useState } from "react";
import { Box, Text, Heading, Image, Button,Flex,useToast } from '@chakra-ui/react'
import { useEffect } from "react";
import { AiOutlineDelete } from 'react-icons/ai'
import { useNavigate } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri"
import { useSelector } from "react-redux";

function WishlistPage(){
    const [wishlistData,setWishlistData]=useState([])
    const userToken=localStorage.getItem("cnc_login")
    const navigate= useNavigate()
    const toast=useToast()


    const getData = async ()=>{
        try {
          let data = await Axios.get(`${API_URL}/apis/wishlist/`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          if (data.data.data.length >0){
            
            setWishlistData(data.data.data)
          } else{
            
            setWishlistData(null)
          }
        } catch (error) {
          
        }
      }
    const addToCart = async(id)=>{
        try {
            let add = await Axios.post(`${API_URL}/apis/wishlist/cart?id=${id}`,{},{
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              toastMessage(add.data.message,"success")
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
    
    useEffect(() => {
      if(userToken){
        getData()
      }
    }, [userToken])
    const messageAuthorize = () => {
      if (!userToken) {
        toast({
          title: "Silahkan login dulu",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else if (role && (role !== 1)) {
        toast({
          title: "Admin tidak bisa mengakses ini!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    };
    const { status, role } = useSelector((state) => {
      return {
        status: state.userReducer.status,
        role: state.userReducer.role,
      };
    })
    useEffect(() => {
      if (!userToken) {
        navigate("/login");
      } else if (role && role !== 1) {
        navigate("/");
      } else if (status && status == 1) {
        navigate("/");
      }
      messageAuthorize();
    }, [role, userToken, status])
    

    return <div className="container">
        {!wishlistData && (
              <div>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100vh"
                >
                  <RiShoppingCartLine size={64} color="#c3c7d1" />
                  <Text
                    fontSize="lg"
                    fontWeight="medium"
                    color="#424749"
                    marginTop={4}
                    textAlign="center"
                  >
                    Kamu belum ada barang yang di wishlist nih
                  </Text>
                  <Button
                    onClick={() => {
                      navigate("/product");
                    }}
                    variant="outline"
                    colorScheme="orange"
                    marginTop={4}
                    leftIcon={<RiShoppingCartLine />}
                  >
                    cek produk kami 
                  </Button>
                </Box>
              </div>
            )}
         <Box py={4} display="flex" flexWrap="wrap">
      <Heading as="h1" size="lg" mb={4} width="100%">
        My Wishlist
      </Heading>
      {wishlistData?.map((item) => (
        <Box
          key={item?.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
          p={4}
          boxShadow="md"
          width="30%"
          height="350px"
          borderRadius="md"
          mr="3%"
          
        >
          <Image src={`${API_URL}/img/product/${item?.Product.product_picture}`} alt={item?.name} mr={4} width="150px" height="150px"/>
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              {item?.Product.name.substring(0,15)}
            </Text>
            <Text color="orange" fontSize="lg" fontWeight="bold" mb={2}>
              {item?.Product.price}
            </Text>
            <Flex mt="auto" justifyContent="space-between" alignItems="center" width="100%">
            <Button colorScheme="orange" variant="solid" mr={2} onClick={()=>{addToCart(item.id_wishlist)}}>
              Add to Cart
            </Button>
            <Button colorScheme="red" variant="solid" onClick={()=>{removeWishlist(item.id_product)}}>
              <AiOutlineDelete />
            </Button>
          </Flex>
          </Box>
        </Box>
      ))}
    </Box>

    </div>
}




export default WishlistPage