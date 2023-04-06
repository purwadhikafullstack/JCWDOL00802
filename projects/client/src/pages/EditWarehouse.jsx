import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { Button, ButtonGroup, Text, Textarea } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../helper";
const EditWarehouse = (props) => {
  const navigate = useNavigate();

  //STATE
  const [nameEdit, setNameEdit] = useState("");
  const [detailAddressEdit, setDetailAddressEdit] = useState("");
  const [phoneNumberEdit, setPhoneNumberEdit] = useState("");
  const [keyProvinceEdit, setKeyProvinceEdit] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinceList, setProvinceList] = useState(null);
  const [cityList, setCityList] = useState(null);
  const [warehouseData, setWarehouseData] = useState(0);

  //GET ID WAREHOUSE
  const location = useLocation();
  const idWarehouse = location.search.split("=")[1];

  // GET DATA
  const getWarehouse = async () => {
    try {
      let warehouse = await Axios.get(
        API_URL + `/warehouse/detailwarehouse?id_warehouse=${idWarehouse}`
      );
      setWarehouseData(warehouse.data[0]);
      setNameEdit(warehouse.data[0].warehouse_branch_name);
      setDetailAddressEdit(warehouse.data[0].detail_address);
      setPhoneNumberEdit(warehouse.data[0].phone_number);
    } catch (error) {
      console.log(error);
    }
  };

  const onGetSelectedCity = async () => {
    try {
      let response = await Axios.get(
        API_URL + `/warehouse/postal?postal=${warehouseData.postal_code}`
      );
      let kota = response.data;
      let container = {
        postal_code: warehouseData.postal_code,
        province_id: kota[0].key_province,
        city_id: kota[0].key_city,
        province: kota[0].province,
        city_name: kota[0].city,
        type: "",
      };
      setSelectedCity(container);
      setKeyProvinceEdit(selectedCity?.province_id);
    } catch (error) {
      console.log(error);
    }
  };

  const onGetProvince = useCallback(async () => {
    try {
      let response = await Axios.get(API_URL + `/rajaongkir/getprovince`);
      setProvinceList(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [keyProvinceEdit]);

  const onGetCity = useCallback(
    async (idprop) => {
      try {
        let response = await Axios.get(
          API_URL + `/rajaongkir/getcity?province=${idprop}`
        );
        let kota = response.data;
        let container = [];
        kota.map((val, idx) => {
          if (val.province_id == idprop) {
            container.push(kota[idx]);
          }
        });
        setCityList(kota);
      } catch (error) {
        console.log(error);
      }
    },
    [keyProvinceEdit]
  );

  //USE EFFECT
  useEffect(() => {
    onGetProvince();
  }, [onGetProvince]);
  useEffect(() => {
    getWarehouse();
  }, []);
  useEffect(() => {
    onGetSelectedCity();
  }, [warehouseData]);

  //PRINT DATA
  let dataProvinceExist = false;
  if (provinceList == null) {
    dataProvinceExist = false;
  } else {
    dataProvinceExist = true;
  }

  const printDataProvince = () => {
    let data = dataProvinceExist ? provinceList : [];
    return data.map((val, idx) => {
      return <option value={val.province_id}>{val.province}</option>;
    });
  };

  let dataCityExist = false;
  if (cityList == null) {
    dataCityExist = false;
  } else {
    dataCityExist = true;
  }

  const printDataCity = () => {
    let data = dataCityExist ? cityList : [];
    return data.map((val, idx) => {
      return (
        <option value={val.city_id}>
          {val.type} {val.city_name}
        </option>
      );
    });
  };

  let onGetPostal = async (keyCity) => {
    try {
      let data = cityList;
      let filterData = data.filter((x) => {
        return x.city_id == keyCity;
      });
      setSelectedCity(filterData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  //FUNCTION BUTTON
  const onEdit = async () => {
    try {
      await Axios.post(API_URL + `/warehouse/editwarehouse`, {
        id_warehouse: idWarehouse,
        warehouse_branch_name: nameEdit,
        phone_number: phoneNumberEdit,
        city: selectedCity?.city_name,
        province: selectedCity?.province,
        postal_code: selectedCity?.postal_code,
        detail_address: detailAddressEdit,
        key_city: selectedCity?.city_id,
        key_province: selectedCity?.province_id,
      }).then((response) => {
        alert("Edit Warehouse Success ✅");
        navigate("/admin/warehouse");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = () => {
    Axios.post(API_URL + `/warehouse/deletewarehouse`, {
      id_warehouse: idWarehouse,
    })
      .then((response) => {
        alert("Delete Warehouse Success ✅");
        navigate("/admin/warehouse");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-white my-5 w-100 p-5 m-auto shadow">
      <Text className="ps-4 pt-3" fontSize="4xl">
        {" "}
        Edit Warehouse
      </Text>
      <div id="regispage" className="row">
        <div className="col-6 px-5">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Nama Warehouse
            </label>
            <input
              type="text"
              className="form-control p-3"
              placeholder="Nama Warehouse"
              value={nameEdit}
              onChange={(e) => setNameEdit(e.target.value)}
            />
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Nomor Telepon
            </label>
            <input
              type="text"
              className="form-control p-3"
              placeholder="Nomor telepon"
              value={phoneNumberEdit}
              onChange={(e) => setPhoneNumberEdit(e.target.value)}
            />
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Alamat Warehouse
            </label>
            <Textarea
              resize="vertical"
              type="text"
              className="form-control p-3"
              placeholder="DESC"
              value={detailAddressEdit}
              onChange={(e) => setDetailAddressEdit(e.target.value)}
            />
          </div>
        </div>
        <div className="col-6 px-5">
          <div className="row bg-white">
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Propinsi</label>
              <select
                onChange={(e) => onGetCity(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option value={selectedCity?.province_id}>
                  {selectedCity?.province}
                </option>
                {printDataProvince()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Kota</label>
              <select
                onChange={(e) => onGetPostal(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option value={selectedCity?.city_id}>
                  {selectedCity?.city_name}
                </option>
                {printDataCity()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">
                Postal Code
              </label>

              <input
                type="text"
                className="form-control p-3"
                placeholder="Kode pos"
                value={selectedCity?.postal_code}
                disabled
              />
            </div>
          </div>
          <ButtonGroup>
            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant="solid"
              onClick={onEdit}
            >
              Simpan
            </Button>

            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant="solid"
              onClick={onDelete}
            >
              Hapus Gudang
            </Button>

            <Link to="/admin/warehouse">
              <Button>Kembali</Button>
            </Link>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default EditWarehouse;
