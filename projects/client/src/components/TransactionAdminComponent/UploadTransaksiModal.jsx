import React, { useState, useEffect, useRef } from "react";
import {
    Text,
    Button,
    Link,
    Card,
    CardBody,
    CardFooter,
    Stack,
    Image,
    Heading,
    Spacer,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    useToast 
} from "@chakra-ui/react";
import { API_URL } from "../../helper";
import Axios from "axios";
import { useForm } from "react-hook-form";


const UploadProofModal = ({ isOpen, onClose, transactionId }) => {
    const fileInputRef = useRef();
    const { register, handleSubmit } = useForm();
    const toast = useToast();

    const onSubmit = async (data) => {
      let getLocalStorage = localStorage.getItem("cnc_login");

      try {
        const formData = new FormData();
    
        const file = fileInputRef.current.files[0];
        if (file) {
          formData.append("transaction_proof", file);
        } else {
          toast({
            title: "No file selected",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
    
        console.log("transactionId:", transactionId);
    
        await Axios.post(
          `${API_URL}/apis/trans/uploadproof?id_transaction=${transactionId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );

        toast({
          title: "Bukti pembayaran berhasil diunggah.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        console.log("axios error:", error);
        toast({
          title: "Terjadi kesalahan saat mengunggah bukti pembayaran.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Bukti Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="file"
                name="transaction_proof"
                accept="image/*"
                {...register("transaction_proof")}
                ref={fileInputRef}
              />
              <Button mt={4} type="submit" colorScheme="orange">
                Upload
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  export default UploadProofModal;