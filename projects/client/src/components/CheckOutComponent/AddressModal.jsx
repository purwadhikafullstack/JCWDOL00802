import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  Box,
  Flex,
  Divider,
  Button,
} from "@chakra-ui/react";

const AddressModal = ({ addresses, onSelect, onClose, isOpen }) => {
    const selectedAddress = addresses?.find((address) => address.priority == 1)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent isFullHeight>
        <ModalHeader borderBottomWidth="1px" borderColor="gray.200" paddingBottom={4}>
          Pilih Alamat Lain
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody height="100%" overflowY="scroll">
          <VStack spacing={4}>
            {addresses?.map((address) => (
              <Box
                key={address.id_address}
                width="100%"
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
                overflow="hidden"
              >
                <Flex direction="column" padding={4}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" maxWidth="100%">
                      {address.receiver}
                    </Text>
                  </Box>
                  <Box>
                    <Text maxWidth="100%">{address.phone_number}</Text>
                  </Box>
                  <Box>
                    <Text maxWidth="100%">{address.detail_address}</Text>
                  </Box>
                </Flex>
                <Divider />
                <Box padding={2}>
                  <Button
                    width="100%"
                    colorScheme={address.priority == 1? "gray" : "orange"}
                    isDisabled= {address.priority == 1? true : false}
                    onClick={() => onSelect(address.id_address)}
                    borderRadius="full"
                    fontSize="lg"
                  >
                    {address.priority == 1? "alamat terpilih" : "Pilih alamat"}
                  </Button>
                </Box>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddressModal;
