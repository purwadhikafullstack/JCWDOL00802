import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import Axios from 'axios';
import { API_URL } from '../../helper';

const TransactionButtons = ({  transactionStatus, id_transaction, setTransactionProofModalVisible, setResiModalVisible, fetchOrderDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [acceptLabel, setAcceptLabel] = useState('');
  const [showResiInput, setShowResiInput] = useState(false);
  const toast = useToast();

  const actions = [
    {
      status: 2,
      title: 'View Transaction Proof',
      acceptLabel: 'Accept',
      showResiInput: false,
    },
    {
      status: 3,
      title: 'Process Transaction',
      acceptLabel: 'Process',
      showResiInput: false,
    },
    {
      status: 5,
      title: 'Send Package',
      acceptLabel: 'Send',
      showResiInput: true,
    },
  ];

  const handleProcessTransaction = async () => {
    try {
      const response = await Axios.post(`${API_URL}/apis/trans/proceed?id=${id_transaction}`);
      if (response.status === 200) {
        toast({
          title: "Transaction processed successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchOrderDetails();
      } else {
        console.error("Failed to process transaction");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDikemasTransaction = async () => {
    try {
      const response = await Axios.post(`${API_URL}/apis/trans/dikemas?id=${id_transaction}`);
      if (response.status === 200) {
        toast({
          title: "Transaction marked as 'dikemas' successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchOrderDetails();
      } else {
        console.error("Failed to mark transaction as 'dikemas'");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = async (action) => {
    setModalTitle(action.title);
    setAcceptLabel(action.acceptLabel);
    setShowResiInput(action.showResiInput);
    setIsModalOpen(true);
    
    if (action.title === "View Transaction Proof") {
      setTransactionProofModalVisible(true);
    } else if (action.title === "Send Package") {
      setResiModalVisible(true);
    } else if (action.title === "Process Transaction") {
      await handleProcessTransaction();
    } else if (action.title === "Dikemas") {
      await handleDikemasTransaction();
    }
};

  return actions
    .filter((action) => action.status === transactionStatus)
    .map((action) => (
      <Button key={action.status} colorScheme="blue" onClick={() => handleButtonClick(action)} mr={2}>
        {action.title}
      </Button>
    ));
};

export default TransactionButtons;
