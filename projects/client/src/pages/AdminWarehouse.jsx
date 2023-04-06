import { Link } from "react-router-dom";
import React from "react";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { useEffect } from "react";

function AdminWarehouse() {
  // STATE
  const [dataWarehouse, setDataWarehouse] = React.useState(null);
  const [search, setSearch] = React.useState("");
  // GET DATA
  const getWarehouse = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let warehouse = await Axios.get(API_URL + `/apis/warehouse/list`, {
        params: { search },
        headers: { Authorization: `Bearer ${getLocalStorage}` },
      });
      setDataWarehouse(warehouse.data);
    } catch (error) {
      console.log(error);
    }
  };

  let dataExist = false;
  if (dataWarehouse == null) {
    dataExist = false;
  } else {
    dataExist = true;
  }

  //   USE EFFECT
  useEffect(() => {
    getWarehouse();
  }, []); //FIRST LAUNCH

  useEffect(() => {
    getWarehouse();
  }, [search]); //KALO SEARCH BERUBAH

  //PRINT DATA
  const printData = () => {
    let data = dataExist ? dataWarehouse : [];
    let num = 0;
    return data.map((val, idx) => {
      let editpage = `/admin/editwarehouse?id_warehouse=${val.id_warehouse}`;
      if (val.status == 1 || val.status == 2) {
        num++;
        let admin = "⚠️ NO ADMIN";
        if (val.status == 2) {
          admin = "✅ ACTIVE";
        } else {
          admin = "⚠️NO ADMIN";
        }
        return (
          <Tr>
            <Td>{num}</Td>
            <Td>{val.warehouse_branch_name}</Td>
            <Td>{val.postal_code}</Td>
            <Td>{val.detail_address}</Td>
            <Td>{val.phone_number}</Td>
            <Td>{admin}</Td>
            <Td>
              <Link to={editpage}>
                <Button type="button" colorScheme="orange" variant="solid">
                  Edit Detail Cabang
                </Button>
              </Link>
            </Td>
          </Tr>
        );
      }
    });
  };

  return (
    <div className="bg-white  w-100 p-5 m-auto ">
      <div className="d-flex my-2">
        <div className="col-6">
          <Text className="ps-4 " fontSize="4xl">
            Pengelolaan Gudang
          </Text>
        </div>
        <div className="col-6">
          <input
            type="text"
            className="form-control p-3"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="my-5">
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Cabang Gudang</Th>
                <Th>Kode Pos</Th>
                <Th>Alamat</Th>
                <Th>No.Telp</Th>
                <Th>Admin</Th>
                <Th>
                  <Link to="/admin/newwarehouse">
                    <Button type="button" colorScheme="orange" variant="solid">
                      Tambah Cabang
                    </Button>
                  </Link>
                </Th>
              </Tr>
            </Thead>
            <Tbody>{printData()}</Tbody>
            <Tfoot>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default AdminWarehouse;
