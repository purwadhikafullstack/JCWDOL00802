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

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Admin Order Detail";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };

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
      if (response.ok) {
        const responseData = await response.json();
        // assuming the API returns success field
        if (responseData.success) {
        } else {
          console.error("Failed to send package");
        }
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProofAccept = async () => {
    setTransactionProofModalVisible(false);

    let getLocalStorage = localStorage.getItem("cnc_login");

    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/acctrans?id=${orderId}`
      );

      const responseData = response.data;
      // assuming the API returns success field
      if (responseData.success) {
      } else {
        console.error("Failed to accept transaction");
      }
    } catch (error) {
      console.error("API request failed");
      console.error(error);
    }
  };

  const handleProofReject = async () => {
    setTransactionProofModalVisible(false);

    let getLocalStorage = localStorage.getItem("cnc_login");

    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/reject?id=${orderId}`
      );
      if (response.ok) {
        const responseData = await response.json();
        // assuming the API returns success field
        if (responseData.success) {
        } else {
          console.error("Failed to reject transaction");
        }
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelTransaction = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");

    try {
      const response = await Axios.post(
        `${API_URL}/apis/trans/cancel?id=${orderId}`,
        {}
      );
      if (response.data.success) {
        // Refresh order details after cancelling the transaction
        fetchOrderDetails();
      } else {
        console.error("Failed to cancel transaction");
      }
    } catch (error) {
      console.error(error);
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
