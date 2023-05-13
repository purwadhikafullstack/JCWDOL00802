import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  GridItem,
  Divider,
  Badge,
  Container,
  Heading,
  Button,
  useToast
} from "@chakra-ui/react";
import { API_URL } from "../helper";
import { useLocation } from "react-router-dom";
import TransactionButtons from "../components/TransactionAdminComponent/TransactionButtons";
import ResiModal from "../components/TransactionAdminComponent/ResiModal";
import TransactionProofModal from "../components/TransactionAdminComponent/TransactionProofModal";
import Axios from "axios";

const OrderListDetail = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id_transaction");
  const [transactionProofModalVisible, setTransactionProofModalVisible] =
    useState(false);
  const [resiModalVisible, setResiModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [acceptLabel, setAcceptLabel] = useState("");
  const [showResiInput, setShowResiInput] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    const response = await fetch(
      `${API_URL}/apis/trans/orderid?id_transaction=${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    );
    const data = await response.json();
    setOrderDetails(data);
  };

  const handleButtonClick = (action) => {
    console.log("Button clicked:", action);
    setCurrentAction(action);
    setModalTitle(action.title);
    setAcceptLabel(action.acceptLabel);
    setShowResiInput(action.showResiInput);
    setIsModalOpen(true);
    if (action.title === "View Transaction Proof") {
      setTransactionProofModalVisible(true);
    } else if (action.title === "Send Package") {
      setResiModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalAccept = (resi) => {
    setIsModalOpen(false);
    // Call API or perform action based on `currentAction`
  };

  const handleSendPackage = async (resi) => {
    setIsModalOpen(false);
    setResiModalVisible(false);
  
    let getLocalStorage = localStorage.getItem("cnc_login");
  
    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/sending`,
        {
          id_transaction: orderId,
          resi: resi,
        },
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Package sent successfully.",
          description: "The resi number has been recorded and the package has been marked as sent.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        fetchOrderDetails(); // This function should refresh the order details
      } else {
        console.error("Failed to send package");
        toast({
          title: "Error",
          description: "Failed to send package.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while sending the package.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleProofAccept = async () => {
    console.log("Proof accepted");
    setTransactionProofModalVisible(false);

    let getLocalStorage = localStorage.getItem("cnc_login");

    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/acctrans?id=${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        }
      );
      
      const responseData = response.data;
      // assuming the API returns success field
      if (responseData.success) {
        console.log("Transaction accepted");
        // Display success toast
        toast({
          title: "Transaction accepted",
          description: "Payment has been successfully accepted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        // Refresh order details
        fetchOrderDetails();
      } else {
        console.error("Failed to accept transaction");
      }
    
    } catch (error) {
      console.error("API request failed");
      console.error(error);
    }    
  };

  const handleProofReject = async () => {
    console.log("Proof rejected");
    setTransactionProofModalVisible(false);

    let getLocalStorage = localStorage.getItem("cnc_login");

    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/reject?id=${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        }
      );
      
      const responseData = response.data;
      // assuming the API returns success field
      if (responseData.success) {
        console.log("Transaction rejected");
        // Display success toast
        toast({
          title: "Transaction rejected",
          description: "Payment has been successfully rejected.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        // Refresh order details
        fetchOrderDetails();
      } else {
        console.error("Failed to reject transaction");
      }
    
    } catch (error) {
      console.error("API request failed");
      console.error(error);
    }
  };


  const handleCancelTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
  
    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/cancel?id=${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        }
      );
      if (response.data.success) {
        console.log("Transaction cancelled");
        toast({
          title: "Transaction cancelled successfully.",
          description: "The transaction has been cancelled.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        fetchOrderDetails(); // This function should refresh the order details
      } else {
        console.error("Failed to cancel transaction");
        toast({
          title: "Error",
          description: "Failed to cancel transaction.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while cancelling the transaction.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  
  if (!orderDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box bg="#eee" minHeight="100vh">
      <Container py={5} maxW="container.xl" centerContent>
        <Box
          w="100%"
          maxW="800px"
          borderWidth={1}
          borderRadius="lg"
          borderColor="#f37a27"
          p={5}
          bg="white"
        >
          <Heading as="h3" size="lg" mb={5} color="#f37a27">
            Order Detail
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={5}>
            <GridItem>
              <Text fontSize="sm" color="gray.500">
                Date
              </Text>
              <Text>{new Date(orderDetails.date).toLocaleDateString()}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.500">
                Order No.
              </Text>
              <Text>{orderDetails.id_transaction}</Text>
            </GridItem>
          </Grid>
          <Box mx={-5} px={5} py={4} bg="#f2f2f2" borderRadius="md">
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <Text>Customer Information</Text>
                <VStack alignItems="start" spacing={1}>
                  <Text>
                    Receiver Name: {orderDetails.alamat_pengiriman.receiver}
                  </Text>
                  <Text>
                    Shipping Address:{" "}
                    {orderDetails.alamat_pengiriman.detail_address}
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <Text>Order Summary</Text>
                <VStack alignItems="start" spacing={1}>
                  <Text>
                    Warehouse: {orderDetails.Warehouse.warehouse_branch_name}
                  </Text>
                  <Text>Shipment Service: {orderDetails.shipment_service}</Text>
                  <Badge
                    colorScheme={
                      orderDetails.Transaction_status.status === 1
                        ? "red"
                        : "green"
                    }
                  >
                    {orderDetails.Transaction_status.description}
                  </Badge>
                </VStack>
              </GridItem>
            </Grid>
          </Box>
          <Heading as="h4" size="md" mt={6} mb={2}>
            Products
          </Heading>
          <Table variant="simple" size="sm" mb={5}>
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>Quantity</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderDetails.Transaction_Details.map((item) => (
                <Tr key={item.id_transaction_detail}>
                  <Td>{item.Product.name}</Td>
                  <Td>{item.total_item}</Td>
                  <Td>{item.purchased_price.toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={5}>
            <GridItem>
              <Text>Weight & Shipping Fee</Text>
              <VStack alignItems="start" spacing={1}>
                <Text>Weight: {orderDetails.weight}g</Text>
                <Text>
                  Shipment Fee: IDR {orderDetails.shipment_fee.toLocaleString()}
                </Text>
              </VStack>
            </GridItem>
            <GridItem textAlign="right">
              <Text>Total Price</Text>
              <Text fontSize="xl" fontWeight="bold">
                IDR {orderDetails.total_price.toLocaleString()}
              </Text>
            </GridItem>
          </Grid>
          <Divider my={4} />
          <Heading as="h4" size="md" mb={4} color="#f37a27">
            Admin Action
          </Heading>
          <TransactionButtons
            transactionStatus={orderDetails.Transaction_status.status}
            id_transaction={orderId}
            setTransactionProofModalVisible={setTransactionProofModalVisible}
            setResiModalVisible={setResiModalVisible}
            fetchOrderDetails={fetchOrderDetails}
          />
          {orderDetails.Transaction_status.status >= 3 &&
            orderDetails.Transaction_status.status <= 5 && (
              <Button colorScheme="red" onClick={handleCancelTransaction}>
                Cancel Transaction
              </Button>
            )}
          <TransactionProofModal
            isOpen={transactionProofModalVisible}
            onClose={() => setTransactionProofModalVisible(false)}
            proofUrl={orderDetails.transaction_proof}
            onAccept={handleProofAccept}
            onReject={handleProofReject}
          />
          <ResiModal
            isOpen={resiModalVisible}
            onClose={() => setResiModalVisible(false)}
            title="Update Resi Number"
            acceptLabel="Accept"
            onAccept={handleSendPackage}
            showResiInput
          />
        </Box>
      </Container>
    </Box>
  );
};

export default OrderListDetail;
