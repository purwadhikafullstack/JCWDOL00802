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
import { format } from "date-fns";
import { API_URL } from "../helper";

const DetailTransaksi = ({ isOpen, onClose, data }) => {
  const [dataDetails, setDataDetails] = useState([]);
  const [dataTrans, setDataTrans] = useState([]);
  let userToken =localStorage.getItem("cnc_login")
 
  const getDataDetail = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    if (data) {
      let dataList = await Axios.get(
        `${API_URL}/apis/trans/detail?id=${data.id_transaction}`,{
        headers: {
    Authorization: `Bearer ${userToken}`,
  },
      }
      );
      setDataDetails(dataList.data.detailTransaction)
      setDataTrans(dataList.data.transaction);
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
        <ModalBody>
        <div className="card">
    <div className="card-body">
      <h5 className="card-title">{dataTrans?.Transaction_status?.description}</h5>
      {dataTrans?.date && <p className="card-text">{format(new Date(dataTrans?.date), "yyyy-MM-dd hh:mm a")}</p>}
    </div>
  </div>

  
  <div className="card mt-3">
    <div className="card-header">Detail Produk</div>
    <ul className="list-group list-group-flush">
      
      {dataDetails?.map((detail, index) => (
        <li key={index} className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">{detail.Product.name}</h6>
            <span className="text-muted">{detail.total_item} x Rp{detail.purchased_price}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0"></p>
            <p className="mb-0">Rp{detail.total_purchased_price}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>

  
  <div className="card mt-3">
    <div className="card-header">Info Pengiriman</div>
    <div className="card-body">
      <p className="mb-0">Kurir: {dataTrans?.shipment_service}</p>
      
      <p className="mb-0">Penerima :   {dataTrans?.alamat_pengiriman?.receiver}</p>
      <p className="mb-0">Alamat:</p>
      <p className="mb-0">{dataTrans?.alamat_pengiriman?.detail_address}</p>
    </div>
  </div>

 
  <div className="card mt-3">
    <div className="card-header">Rincian Pembayaran</div>
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center">
        <p className="mb-0">Total Harga</p>
        <p className="mb-0">Rp{dataTrans?.total_price}</p>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <p className="mb-0">Total Ongkos Kirim ({dataTrans?.weight})</p>
        <p className="mb-0">Rp{dataTrans?.shipment_fee}</p>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Total</h5>
        <h5 className="mb-0">Rp{parseInt(dataTrans?.total_price) + parseInt(dataTrans?.shipment_fee)}</h5>
      </div>
    </div>
  </div>
        </ModalBody>

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
