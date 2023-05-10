import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Select,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function AdminWarehouse() {
  // STATE
  const [dataWarehouse, setDataWarehouse] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [adminList, setAdminList] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentWarehouseId, setCurrentWarehouseId] = useState(null);
  const toast = useToast();
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false);
  const [warehouseIdToRemove, setWarehouseIdToRemove] = useState(null);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);

  // GET DATA
  const getWarehouse = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let warehouse = await Axios.post(
        API_URL + `/apis/warehouse/list`,
        { search, order, limit, page: parseInt(page) - 1 },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      setPage(warehouse.data.page + 1);
      setDataWarehouse(warehouse.data.data);
      setLastPage(warehouse.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  
  //for assign admin

  const getAdminList = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let adminListResponse = await Axios.get(
        API_URL + `/apis/warehouseAdmin/adminlist`
      );
      setAdminList(adminListResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdminAssignment = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      console.log(
        `selectedAdmin: ${selectedAdmin}, currentWarehouseId: ${currentWarehouseId}`
      );
      await Axios.post(API_URL + `/apis/warehouseAdmin/assign`, {
        id_user: selectedAdmin,
        id_warehouse: currentWarehouseId,
      });
      toast({
        title: "Success",
        description: "Update Successfully",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      getAdminList();
      onClose();
      getWarehouse();
    } catch (error) {
      console.log(error);
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const onRemoveAdmin = (id_warehouse) => {
    setWarehouseIdToRemove(id_warehouse);
    setIsOpenAlertDialog(true);
  };

  const onCancelRemoveAdmin = () => {
    setIsOpenAlertDialog(false);
  };

  const onConfirmRemoveAdmin = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      await Axios.delete(
        API_URL +
          `/apis/warehouseAdmin/remove?id_warehouse=${warehouseIdToRemove}`
      );
      getWarehouse();
      getAdminList();
      setIsOpenAlertDialog(false);
      showToast("Success", "Admin removed successfully", "success");
      setIsOpenAlertDialog(false);
    } catch (error) {
      console.log(error);
      showToast("Error", "Failed to remove admin", "error");
      setIsOpenAlertDialog(false);
    }
  };

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (search != "" || order != 0) {
      setPage(1);
      setOnFilter(true);
      getWarehouse();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setOrder(0);
    setOnFilter(false);
  };

  //   USE EFFECT
  useEffect(() => {
    getWarehouse();
    getAdminList();
  }, [page, limit, onFilter]);

  //PRINT DATA
  const printData = () => {
    let data = dataWarehouse ? dataWarehouse : [];
    // let num = 0;
    return data.map((val, idx) => {
      let editpage = `/admin/editwarehouse?id_warehouse=${val.id_warehouse}`;
      if (val.status == 1 || val.status == 2) {
        // num++;
        let admin = "⚠️ NO ADMIN";
        if (val.status == 2) {
          admin = "✅ ACTIVE";
        } else {
          admin = "⚠️NO ADMIN";
        }
        return (
          <Tr>
            {/* <Td>{num}</Td> */}
            <Td>{val.warehouse_branch_name}</Td>
            <Td>{val.detail_address.substring(0, 30)}</Td>
            <Td>{admin}</Td>
            <Td>
              <Link to={editpage}>
                <Button
                  size="sm"
                  type="button"
                  colorScheme="orange"
                  variant="solid"
                >
                  Edit Gudang
                </Button>
              </Link>
            </Td>
            <Td>
              {val.status === 1 && (
                <Button
                  type="button"
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => {
                    setCurrentWarehouseId(val.id_warehouse);
                    onOpen();
                  }}
                >
                  Assign Admin
                </Button>
              )}
              {val.status === 2 && (
                <Button
                  type="button"
                  colorScheme="red"
                  variant="solid"
                  onClick={() => onRemoveAdmin(val.id_warehouse)}
                >
                  Remove Admin
                </Button>
              )}
            </Td>
          </Tr>
        );
      }
    });
  };

  return (
    <div className="paddingmain">
      <div>
        <Text fontSize="2xl">Pengelolaan Gudang </Text>
      </div>
      <div className="d-flex">
        <div className="col-9 rounded p-3 tablebox">
          <TableContainer className="rounded">
            <Table>
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">Cabang Gudang</Th>
                  <Th color="#ffffff">Alamat</Th>
                  <Th color="#ffffff">Admin</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody className="tablebody">{printData()}</Tbody>
            </Table>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Assign Admin to Warehouse</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Admin Name</Th>
                        <Th>Email</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {adminList.length > 0 ? (
                        adminList.map((admin, index) => (
                          <Tr
                            key={admin.id_user}
                            onClick={() => {
                              setSelectedAdmin(admin.id_user);
                              setSelectedAdminIndex(index);
                            }}
                            style={{
                              cursor: "pointer",
                              backgroundColor:
                                selectedAdminIndex === index
                                  ? "lightgray"
                                  : "transparent",
                            }}
                          >
                            <Td>{admin.full_name}</Td>
                            <Td>{admin.email}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="3" textAlign="center">
                            No available admins
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleAdminAssignment}
                    isDisabled={
                      adminList.length === 0 || selectedAdmin === null
                    }
                  >
                    Assign
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TableContainer>
          <AlertDialog
            isOpen={isOpenAlertDialog}
            leastDestructiveRef={undefined}
            onClose={onCancelRemoveAdmin}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Remove Admin
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to remove the admin from this warehouse?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button variant="ghost" onClick={onCancelRemoveAdmin}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={onConfirmRemoveAdmin}
                    ml={3}
                  >
                    Remove
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <div
            className="d-flex my-5"
            style={{ alignContent: "center", justifyContent: "center" }}
          >
            <PaginationOrder
              currentPage={parseInt(page)}
              totalPages={parseInt(lastPage)}
              onPageChange={setPage}
              maxLimit={0}
            />
            <div
              className="d-flex mx-5"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              menampilkan
              <Input
                type="text"
                placeholder="limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                style={{ width: "60px" }}
              />
              gudang
            </div>
          </div>
        </div>
        <div className="col-3 rounded shadow mt-3 p-3 filterbox">
          <div className="inputfilter">
            <div>Filter</div>
            <Input
              type="text"
              className="form-control mt-3"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inputfilter">
            <Select
              onChange={(e) => setOrder(e.target.value)}
              className="form-control form-control-lg mt-3"
            >
              <option value={0}>Urutkan</option>
              <option value={1} selected={order == 1}>
                Nama:A-Z
              </option>
              <option value={2} selected={order == 2}>
                Nama:Z-A
              </option>
            </Select>
          </div>
          <br />
          <ButtonGroup>
            <Button
              type="button"
              colorScheme="orange"
              variant="solid"
              onClick={() => onSetFilter()}
            >
              Set Filter
            </Button>
            <Button
              type="button"
              colorScheme="orange"
              variant={onFilter ? "solid" : "outline"}
              onClick={() => onResetFilter()}
              isDisabled={!onFilter}
            >
              Reset Filter
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default AdminWarehouse;
