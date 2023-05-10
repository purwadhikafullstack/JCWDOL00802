import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';

const ResiModal = ({ isOpen, onClose, title, acceptLabel, onAccept, onConfirm, showResiInput }) => {
  const [resi, setResi] = React.useState('');

  const handleAccept = () => {
    if (showResiInput) {
      onAccept(resi);
    } else {
      onAccept();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            {showResiInput && (
              <FormControl id="resi">
                <FormLabel>Resi Number</FormLabel>
                <Input type="text" onChange={(e) => setResi(e.target.value)} />
              </FormControl>
            )}
            <Button colorScheme="blue" onClick={handleAccept}>
              {acceptLabel}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ResiModal;
