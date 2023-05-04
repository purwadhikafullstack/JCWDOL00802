import React, { useState } from "react";
import { API_URL } from "../helper";
import Axios from "axios";
import { Text, Button, Image, Input, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
} from "reactstrap";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Paging from "../components/Pagination";

function RequestStock() {
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  // STATE
  const [dataReceive, setDataReceive] = useState(null);
  const [searchReceive, setSearchReceive] = useState("");
  const [orderReceive, setOrderReceive] = useState(0);
  const [dataWarehouseReceive, setDataWarehouseReceive] = useState();
  const [dataCategoryReceive, setDataCategoryReceive] = useState();
  const [dataStatusReceive, setDataStatusReceive] = useState();
  const [selectedCategoryReceive, setSelectedCategoryReceive] = useState("");
  const [selectedStatusReceive, setSelectedStatusReceive] = useState("");
  const [selectedWarehouseReceive, setSelectedWarehouseReceive] = useState("");
  const [dataSend, setDataSend] = useState(null);
  const [searchSend, setSearchSend] = useState("");
  const [orderSend, setOrderSend] = useState(0);
  const [dataWarehouseSend, setDataWarehouseSend] = useState();
  const [dataCategorySend, setDataCategorySend] = useState();
  const [dataStatusSend, setDataStatusSend] = useState();
  const [selectedCategorySend, setSelectedCategorySend] = useState("");
  const [selectedStatusSend, setSelectedStatusSend] = useState("");
  const [selectedWarehouseSend, setSelectedWarehouseSend] = useState("");

  //PAGINATION
  const [pageReceive, setPageReceive] = useState(1);
  const [lastPageReceive, setLastPageReceive] = useState(0);
  const [pageSend, setPageSend] = useState(1);
  const [lastPageSend, setLastPageSend] = useState(0);

  //MODAL
  const [modal, setModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [courier, setCourier] = useState("");
  const [resi, setResi] = useState("");

  // GET DATA

  const getWarehouse = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehouse`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setDataWarehouseReceive(response.data);
      setSelectedWarehouseReceive(response.data[0].id_warehouse);
      setDataWarehouseSend(response.data);
      setSelectedWarehouseSend(response.data[0].id_warehouse);
    });
  };

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategoryReceive(response.data);
      setDataCategorySend(response.data);
    });
  };

  const getWarehouseMutationStatus = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehousemuattionstatus`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setDataStatusReceive(response.data);
      setDataStatusSend(response.data);
    });
  };

  const getMutationReceive = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let mutation = await Axios.post(
        API_URL + `/apis/product/getmutation`,
        {
          search: searchReceive,
          warehouseReceive: selectedWarehouseReceive,
          warehouseSend: "",
          category: selectedCategoryReceive,
          order: orderReceive,
          page: parseInt(pageReceive) - 1,
          status: selectedStatusReceive,
        },
        {
          headers: { Authorization: `Bearer ${getLocalStorage}` },
        }
      );
      setPageReceive(mutation.data.page + 1);
      setLastPageReceive(mutation.data.total_page);
      setDataReceive(mutation.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  let dataReceiveExist = false;
  if (dataReceive == null) {
    dataReceiveExist = false;
  } else {
    dataReceiveExist = true;
  }

  const getMutationSend = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let mutation = await Axios.post(
        API_URL + `/apis/product/getmutation`,
        {
          search: searchSend,
          warehouseReceive: "",
          warehouseSend: selectedWarehouseSend,
          category: selectedCategorySend,
          order: orderSend,
          page: parseInt(pageSend) - 1,
          status: selectedStatusSend,
        },
        {
          headers: { Authorization: `Bearer ${getLocalStorage}` },
        }
      );
      setPageSend(mutation.data.page + 1);
      setLastPageSend(mutation.data.total_page);
      setDataSend(mutation.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  let dataSendExist = false;
  if (dataSend == null) {
    dataSendExist = false;
  } else {
    dataSendExist = true;
  }

  //BUTTON FUNCTION
  const modalButton = (val) => {
    setModal(true);
    setDataModal(val);
  };

  //FUNCTION AXIOS
  const onApprove = () => {
    Axios.post(
      API_URL + `/apis/product/approvestockmove`,
      {
        id_mutation: dataModal?.id_mutation,
        from_id_warehouse: dataModal?.sender.id_warehouse,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
        },
      }
    )
      .then((response) => {
        alert("Approve Success ✅");
        setModal(false);
        getMutationSend();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onReject = () => {
    let text = `Apa anda mau menolak request ini?`;
    if (window.confirm(text) == true) {
      let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
      Axios.post(
        API_URL + `/apis/product/rejectstockmove`,
        {
          id_mutation: dataModal?.id_mutation,
          input: dataModal?.total_item,
          id_product: dataModal?.Product.id_product,
          id_warehouse: dataModal?.sender.id_warehouse,
          date: tanggal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      )
        .then((response) => {
          alert("Reject Success ✅");
          setModal(false);
          getMutationSend();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onSend = () => {
    Axios.post(
      API_URL + `/apis/product/sendstockmove`,
      {
        id_mutation: dataModal?.id_mutation,
        resi,
        courier,
        from_id_warehouse: dataModal?.sender.id_warehouse,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
        },
      }
    )
      .then((response) => {
        alert("Send Success ✅");
        setModal(false);
        getMutationSend();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onAccepted = () => {
    let text = `Apa anda sudah menerima barang ini?`;
    if (window.confirm(text) == true) {
      let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
      Axios.post(
        API_URL + `/apis/product/acceptedstockmove`,
        {
          id_mutation: dataModal?.id_mutation,
          input: dataModal?.total_item,
          id_product: dataModal?.Product.id_product,
          id_warehouse: dataModal?.receiver.id_warehouse,
          date: tanggal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      )
        .then((response) => {
          alert("Accepted Success ✅");
          setModal(false);
          getMutationReceive();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //   USE EFFECT

  useEffect(() => {
    setPageReceive(0);
  }, [
    selectedWarehouseReceive,
    selectedCategoryReceive,
    orderReceive,
    searchReceive,
    selectedStatusReceive,
  ]);

  useEffect(() => {
    setPageSend(0);
  }, [
    selectedWarehouseSend,
    selectedCategorySend,
    orderSend,
    searchSend,
    selectedStatusSend,
  ]);

  useEffect(() => {
    getMutationReceive();
  }, [
    pageReceive,
    searchReceive,
    orderReceive,
    selectedCategoryReceive,
    selectedWarehouseReceive,
    selectedStatusReceive,
  ]);

  useEffect(() => {
    getMutationSend();
  }, [
    pageSend,
    searchSend,
    orderSend,
    selectedCategorySend,
    selectedWarehouseSend,
    selectedStatusSend,
  ]);

  useEffect(() => {
    getWarehouse();
  }, []);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getWarehouseMutationStatus();
  }, []);

  //PRINT DATA
  const printDataReceive = () => {
    let data = dataReceiveExist ? dataReceive : [];

    return data.map((val, idx) => {
      let gambar = `${API_URL}/img/product/${val.Product.product_picture}`;
      let status = " text-light bg-muted";
      let nama = val.Product.name;
      if (val.status == 1 || val.status == 2) {
        status = "text-light bg-primary";
      } else if (val.status == 3 || val.status == 4) {
        status = "text-light bg-info";
      } else if (val.status == 5) {
        status = "bg-warning";
      } else if (val.status == 6) {
        status = "text-light bg-success";
      } else if (val.status == 7 || val.status == 8) {
        status = "text-light bg-secondary";
      }
      return (
        <Card
          className="my-2 mx-2 shadow"
          color="secondary"
          outline
          style={{
            width: "300px",
          }}
        >
          <CardHeader className={status}>
            {val.warehouse_mutation_status.description}
          </CardHeader>
          <div className=" d-flex" style={{ justifyContent: "center" }}>
            <Image
              src={gambar}
              alt={val.Product.name}
              maxW={{ sm: "100px" }}
              className="my-2"
            />
          </div>
          <CardTitle tag="h5" className="mx-2 my-2">
            {nama.substring(0, 30)}
          </CardTitle>
          <Button
            className="my-2 mx-2"
            type="button"
            width="10"
            colorScheme="orange"
            variant="solid"
            size="xs"
            onClick={() => modalButton(val)}
          >
            Detail
          </Button>
        </Card>
      );
    });
  };
  const printSelectWarehouseReceive = () => {
    let data = dataWarehouseReceive;
    if (dataWarehouseReceive) {
      return data.map((val, idx) => {
        if (val.status == 2 || val.status == 1) {
          return (
            <option
              value={val?.id_warehouse}
              selected={val.id_warehouse == selectedWarehouseReceive}
            >
              {val?.warehouse_branch_name}
            </option>
          );
        }
      });
    }
  };
  const printCategoryReceive = () => {
    let data = dataCategoryReceive;
    if (dataCategoryReceive) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.id_category}
            selected={val.id_category == selectedCategoryReceive}
          >
            {val?.category}
          </option>
        );
      });
    }
  };
  const printStatusReceive = () => {
    let data = dataStatusReceive;
    if (dataStatusReceive) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.warehouse_mutation_statuses}
            selected={val.warehouse_mutation_statuses == selectedStatusReceive}
          >
            {val?.description}
          </option>
        );
      });
    }
  };

  const printSelectWarehouseSend = () => {
    let data = dataWarehouseSend;
    if (dataWarehouseSend) {
      return data.map((val, idx) => {
        if (val.status == 2 || val.status == 1) {
          return (
            <option
              value={val?.id_warehouse}
              selected={val.id_warehouse == selectedWarehouseSend}
            >
              {val?.warehouse_branch_name}
            </option>
          );
        }
      });
    }
  };
  const printCategorySend = () => {
    let data = dataCategorySend;
    if (dataCategorySend) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.id_category}
            selected={val.id_category == selectedCategorySend}
          >
            {val?.category}
          </option>
        );
      });
    }
  };

  const printStatusSend = () => {
    let data = dataStatusSend;
    if (dataStatusSend) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.warehouse_mutation_statuses}
            selected={val.warehouse_mutation_statuses == selectedStatusSend}
          >
            {val?.description}
          </option>
        );
      });
    }
  };
  const printDataSend = () => {
    let data = dataSendExist ? dataSend : [];

    return data.map((val, idx) => {
      let gambar = `${API_URL}/img/product/${val.Product.product_picture}`;
      let status = " text-light bg-muted";
      let nama = val.Product.name;
      if (val.status == 1 || val.status == 2) {
        status = "text-light bg-primary";
      } else if (val.status == 3 || val.status == 4) {
        status = "text-light bg-info";
      } else if (val.status == 5) {
        status = "bg-warning";
      } else if (val.status == 6) {
        status = "text-light bg-success";
      } else if (val.status == 7 || val.status == 8) {
        status = "text-light bg-secondary";
      }
      return (
        <Card
          className="my-2 mx-2 shadow"
          color="secondary"
          outline
          style={{
            width: "300px",
          }}
        >
          <CardHeader className={status}>
            {val.warehouse_mutation_status.description}
          </CardHeader>
          <div className=" d-flex" style={{ justifyContent: "center" }}>
            <Image
              src={gambar}
              alt={val.Product.name}
              maxW={{ sm: "100px" }}
              className="my-2"
            />
          </div>
          <CardTitle tag="h5" className="mx-2 my-2">
            {nama.substring(0, 30)}
          </CardTitle>
          <Button
            className="my-2 mx-2"
            type="button"
            width="10"
            colorScheme="orange"
            variant="solid"
            size="xs"
            onClick={() => modalButton(val)}
          >
            Detail
          </Button>
        </Card>
      );
    });
  };
  //PRINT MODAL
  const printModal = () => {
    //KONDISI TOMBOL
    //ON HOLD MANUAL->ACCEPTED
    let approve = false;
    if (
      dataModal?.status == 2 &&
      role == 2 &&
      selectedWarehouseSend == dataModal?.sender.id_warehouse
    ) {
      approve = true;
    }
    //ACCEPTED -> SENT
    let kirim = false;
    let status = false;
    if (dataModal?.status == 3 || dataModal?.status == 4) {
      status = true;
    }
    if (
      status &&
      role == 2 &&
      selectedWarehouseSend == dataModal?.sender.id_warehouse
    ) {
      kirim = true;
    }
    //SENT->COMPLETED
    let terima = false;
    if (
      dataModal?.status == 5 &&
      role == 2 &&
      selectedWarehouseReceive == dataModal?.receiver.id_warehouse
    ) {
      terima = true;
    }
    return (
      <Modal isOpen={modal}>
        <ModalHeader>{dataModal?.Product.name}</ModalHeader>
        <ModalBody>
          <Image
            src={`${API_URL}/img/product/${dataModal?.Product.product_picture}`}
            alt={dataModal?.Product.name}
            maxW={{ sm: "100px" }}
            className="my-2"
          />
          <div>status: {dataModal?.warehouse_mutation_status.description}</div>
          <div>Pengirim: {dataModal?.sender.warehouse_branch_name}</div>
          <div>Alamat Pengirim: {dataModal?.sender.detail_address}</div>
          <div>Penerima: {dataModal?.receiver.warehouse_branch_name}</div>
          <div>Alamat Penerima: {dataModal?.receiver.detail_address}</div>
          <div>jumlah barang: {dataModal?.total_item}</div>
          <div>Catatan: {dataModal?.notes}</div>
          <div>Kurir: {dataModal?.courier}</div>
          <div>Resi: {dataModal?.resi}</div>
        </ModalBody>
        <ModalFooter>
          {approve && (
            <ButtonGroup>
              <Button colorScheme="orange" className="mx-2" onClick={onApprove}>
                Setuju
              </Button>
              <Button colorScheme="red" onClick={() => onReject()}>
                Tidak Setuju
              </Button>
            </ButtonGroup>
          )}
          {kirim && (
            <div>
              <Select
                onChange={(e) => setCourier(e.target.value)}
                className="form-control form-control-lg"
              >
                <option>Pilih Kurir</option>
                <option value="pos">POS</option>
                <option value="jne">JNE</option>
                <option value="tiki">TIKI</option>
              </Select>
              <Input
                type="text"
                className="form-control mt-3"
                placeholder="RESI"
                value={resi}
                onChange={(e) => setResi(e.target.value)}
              />
              <ButtonGroup>
                <Button
                  colorScheme="yellow"
                  className="mx-2"
                  onClick={() => onSend()}
                >
                  Kirim
                </Button>
              </ButtonGroup>
            </div>
          )}
          {terima && (
            <ButtonGroup>
              <Button
                colorScheme="green"
                className="mx-2"
                onClick={() => onAccepted()}
              >
                Terima Barang
              </Button>
            </ButtonGroup>
          )}
          <Button color="secondary" onClick={() => setModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="bg-white w-100 m-auto ">
      <div>
        <Text fontSize="2xl">Request Stock</Text>
      </div>
      <br />
      <hr />
      <div className="d-flex my-2"></div>
      <div>
        <Text fontSize="2xl">Barang Keluar</Text>
        <div className="my-2 d-flex">
          <div className="col-2">
            <Input
              type="text"
              className="form-control p-3"
              placeholder="search"
              value={searchSend}
              onChange={(e) => setSearchSend(e.target.value)}
            />
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setSelectedWarehouseSend(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              {role == 3 && <option value="">all warehouse</option>}
              {printSelectWarehouseSend()}
            </Select>
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setSelectedCategorySend(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              <option value="">all category</option>
              <option value={0}>No Category</option>
              {printCategorySend()}
            </Select>
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setOrderSend(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              <option value={0}>Paling Sesuai </option>
              <option value={1}>Tanggal Ascending</option>
              <option value={2}>Tanggal Descending</option>
            </Select>
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setSelectedStatusSend(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              <option value="">All Status</option>
              {printStatusSend()}
            </Select>
          </div>
        </div>
        <div className="my-2  d-flex">{printDataSend()}</div>
        <div
          className="d-flex"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Paging first={pageSend} second={lastPageSend} third={setPageSend} />
        </div>
      </div>
      <hr />
      <br />
      <div>
        <Text fontSize="2xl">Barang Masuk</Text>
        <div className="my-2  d-flex">
          <div className="col-2">
            <Input
              type="text"
              className="form-control p-3"
              placeholder="search"
              value={searchReceive}
              onChange={(e) => setSearchReceive(e.target.value)}
            />
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setSelectedWarehouseReceive(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              {role == 3 && <option value="">all warehouse</option>}
              {printSelectWarehouseReceive()}
            </Select>
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setSelectedCategoryReceive(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              <option value="">all category</option>
              <option value={0}>No Category</option>
              {printCategoryReceive()}
            </Select>
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setOrderReceive(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              <option value={0}>Paling Sesuai </option>
              <option value={1}>Tanggal Ascending</option>
              <option value={2}>Tanggal Descending</option>
            </Select>
          </div>
          <div className="col-2">
            <Select
              onChange={(e) => setSelectedStatusReceive(e.target.value)}
              className="form-control form-control-lg 
          "
            >
              <option value="">All Status</option>
              {printStatusReceive()}
            </Select>
          </div>
        </div>
        <div className="my-2  d-flex">{printDataReceive()}</div>
        <div
          className="d-flex"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* {printPaginationReceive()} */}
          <Paging
            first={pageReceive}
            second={lastPageReceive}
            third={setPageReceive}
          />
        </div>
      </div>
      {/*  */}
      <div>{printModal()}</div>
    </div>
  );
}

export default RequestStock;
