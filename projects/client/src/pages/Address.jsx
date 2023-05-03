import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";
import { API_URL } from "../helper";
import Axios from "axios";
import NewAddressModal from "../components/AddressComponent/NewAddressModal";
import EditAddressModal from "../components/AddressComponent/EditAddressModal";
import {
  Box,
  Text,
  Button,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
  Spacer,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

function Address() {
  const navigate = useNavigate();
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] =
    React.useState(false);
  const [dataAddress, setDataAddress] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] =
    React.useState(false);

  const [addressListRefresh, setAddressListRefresh] = React.useState(false);

  const triggerAddressListRefresh = () => {
    setAddressListRefresh(!addressListRefresh);
  };

  const handleEditAddressModalClose = () => {
    setIsEditAddressModalOpen(false);
  };

  const handleUpdateClick = (id_address) => {
    setSelectedAddressId(id_address);
    setIsEditAddressModalOpen(true);
  };

  const getAddress = async () => {
    try {
      let address = await Axios.get(API_URL + `/apis/address/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
        },
      });
      console.log(`res data ${address.data}`);
      setDataAddress(address.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id_address) => {
    try {
      await Axios.delete(API_URL + `/apis/address/delete`, {
        data: { id_address },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
        },
      });
      alert("Delete Address Success ✅");
      getAddress(); // Refresh the address list after deletion
    } catch (error) {
      console.log(error);
    }
  };

  const setDefaultAddress = async (id_address) => {
    try {
      await Axios.post(
        API_URL + "/apis/address/setdefault",
        { id_address },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      );
      alert("Address set as default successfully ✅");
      getAddress(); // Refresh the address list after setting the default address
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (id_address) => {
    setSelectedAddressId(id_address);
    setIsOpen(true);
  };

  let dataExist = false;
  if (dataAddress == null) {
    dataExist = false;
  } else {
    dataExist = true;
  }

  useEffect(() => {
    getAddress();
  }, [addressListRefresh]);

  const printData = () => {
    let data = dataExist ? dataAddress : [];
    return data.map((val, idx) => {
      return (
        <>
          {idx === 0 && (
            <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
              <Text fontSize="4xl">Address List</Text>
            </Flex>
          )}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p="6"
            w="55%"
            mb="4"
            key={idx}
          >
            <Flex>
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {val.receiver}
                </Text>
                <Text>{val.phone_number}</Text>
                <Text mt="2">{val.detail_address}</Text>
                <Text>{`${val.lala.city}, ${val.lala.province} ${val.postal_code}`}</Text>
              </Box>
              <Spacer />
              <Flex flexDirection="column" alignItems="flex-end">
                {val.priority === 1 && (
                  <IconButton
                    icon={<CheckIcon />}
                    colorScheme="green"
                    variant="outline"
                    isRound
                    size="sm"
                    mb="4"
                  />
                )}
                {val.priority !== 1 && (
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    mb="4"
                    size="sm"
                    onClick={() => setDefaultAddress(val.id_address)}
                  >
                    Set Default
                  </Button>
                )}
              </Flex>
            </Flex>
            <Spacer />
            <Flex justifyContent="flex-start" mt="4" alignItems="center">
              <Text
                color="blue.500"
                cursor="pointer"
                onClick={() => {
                  handleUpdateClick(val.id_address);
                }}
              >
                Update Address
              </Text>
              <Text mx="2">|</Text>
              <Text
                color="red.500"
                cursor="pointer"
                onClick={() => handleDeleteClick(val.id_address)}
              >
                Delete Address
              </Text>
            </Flex>
          </Box>
        </>
      );
    });
  };

  return (
    <div className="bg-white my-5 w-100 p-5 m-auto shadow">
      <VStack spacing={6} align="stretch" ml="20%">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb="4"
          width="55%"
        >
          <Spacer />
          <Box position="relative">
            <Box position="absolute" top="20px" right="0">
              <NewAddressModal
                onAddressListRefresh={triggerAddressListRefresh}
              />
            </Box>
          </Box>
        </Flex>
        {printData()}
      </VStack>
      <EditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={handleEditAddressModalClose}
        id_address={selectedAddressId}
        updateTrigger={addressListRefresh}
        setUpdateTrigger={triggerAddressListRefresh}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Address
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onDelete(selectedAddressId);
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}

export default Address;
