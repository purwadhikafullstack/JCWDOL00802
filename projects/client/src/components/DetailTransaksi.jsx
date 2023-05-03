import Axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { API_URL } from "../helper";

const DetailTransaksi = ({ isOpen, onClose, data }) => {
  const [dataDetails, setDataDetails] = useState([]);
  const getDataDetail = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    if (data) {
      let dataList = await Axios.get(
        `${API_URL}/apis/trans/detail?id=${data.id_transaction}`
      );
      setDataDetails(dataList.data);
    }
  };
  useEffect(() => {
    getDataDetail();
  }, [data]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button colorScheme="orange" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailTransaksi;
