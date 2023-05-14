import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Button,
  HStack,
} from '@chakra-ui/react';

const TransactionProofModal = ({ isOpen, onClose, proofUrl, onAccept, onReject }) => {
  const isAcceptDisabled = !proofUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transaction Proof</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src={proofUrl} alt="Transaction Proof" />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
          <Button colorScheme="green" onClick={onAccept} isDisabled={isAcceptDisabled}>
              Accept
            </Button>
            <Button colorScheme="red" onClick={onReject}>
              Reject
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionProofModal;
