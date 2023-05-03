import { useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const AddressList = ({ addresses, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses?.find((address) => address.priority === 1)
  );

  const handleSelect = (addressId) => {
    const selected = addresses.find((address) => address.id_address === addressId);
    setSelectedAddress(selected);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} bg="orange.300" _hover={{ bg: "orange.400" }}>
        {selectedAddress ? (
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            <Flex alignItems="flex-start" flexDir="column">
              <Text fontWeight="bold">{selectedAddress.receiver}</Text>
              <Text fontSize="sm">{selectedAddress.phone_number}</Text>
              <Text fontSize="sm">{selectedAddress.detail_address}</Text>
            </Flex>
            <Text fontWeight="bold" color="blue.500" mr={4}>
              Pilih Alamat Lain
            </Text>
          </Flex>
        ) : (
          "Tambahkan Alamat"
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pilih Alamat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {addresses?.map((address) => (
              <Flex
                alignItems="flex-start"
                justifyContent="space-between"
                w="100%"
                p={2}
                bg={address.id_address === selectedAddress?.id_address && "gray.100"}
                key={address.id_address}
              >
                <div>
                  <Text fontWeight="bold">{address.receiver}</Text>
                  <Text fontSize="sm">{address.detail_address}</Text>
                  <Text fontSize="sm">{address.phone_number}</Text>
                </div>
                <Button
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                  ml="auto"
                  onClick={() => handleSelect(address.id_address)}
                  disabled={address.id_address === selectedAddress?.id_address}
                >
                  Pilih
                </Button>
              </Flex>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsOpen(false)} mr={3}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddressList;
