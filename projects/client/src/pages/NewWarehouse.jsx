import React, { useEffect } from "react";
import Axios from "axios";
import { Button, ButtonGroup, Text, Textarea } from "@chakra-ui/react";
import { API_URL } from "../helper";
import { useNavigate } from "react-router-dom";

const NewWarehouse = (props) => {
  const navigate = useNavigate();

  //STATE
  const [nameEdit, setNameEdit] = React.useState("");
  const [detailAddressEdit, setDetailAddressEdit] = React.useState("");
  const [phoneNumberEdit, setPhoneNumberEdit] = React.useState("");
  const [keyProvinceEdit, setKeyProvinceEdit] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState(null);
  const [provinceList, setProvinceList] = React.useState(null);
  const [cityList, setCityList] = React.useState(null);

  //GET DATA
  let onGetProvince = async () => {
    try {
      let response = await Axios.get(API_URL + `/apis/rajaongkir/getprovince`);
      setProvinceList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  let onGetCity = async (idprop) => {
    try {
      setKeyProvinceEdit(idprop);
      let response = await Axios.get(
        API_URL + `/apis/rajaongkir/getcity?province=${idprop}`
      );
      let kota = response.data;
      let container = [];
      kota.map((val, idx) => {
        if (val.province_id == idprop) {
          container.push(kota[idx]);
        }
      });
      setCityList(container);
    } catch (error) {
      console.log(error);
    }
  };

  //USE EFFECT
  useEffect(() => {
    onGetProvince();
  }, []);

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
  const onAdd = () => {
    Axios.post(API_URL + `/apis/warehouse/addwarehouse`, {
      warehouse_branch_name: nameEdit,
      phone_number: phoneNumberEdit,
      city: selectedCity?.city_name,
      province: selectedCity?.province,
      postal_code: selectedCity?.postal_code,
      detail_address: detailAddressEdit,
      key_city: selectedCity?.city_id,
      key_province: selectedCity?.province_id,
    })
      .then((response) => {
        alert("Add Warehouse Success ✅");
        navigate("/admin/warehouse");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-white  w-100 p-5 m-auto ">
      <Text className="ps-4 pt-3" fontSize="4xl">
        {" "}
        Add Warehouse
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
              type="text"
              className="form-control p-3"
              placeholder="DESC"
              style={{
                resize: "none",
                height: "250px",
              }}
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
                <option>Pilih Propinsi</option>
                {printDataProvince()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Kota</label>
              <select
                onChange={(e) => onGetPostal(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option>Pilih Kota</option>
                {printDataCity()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">
                Postal Code
              </label>
              {selectedCity !== null && (
                <input
                  type="text"
                  className="form-control p-3"
                  placeholder="Kode pos"
                  value={selectedCity.postal_code}
                  disabled
                />
              )}
              {selectedCity == null && (
                <input
                  type="text"
                  className="form-control p-3"
                  placeholder="Kode pos"
                  disabled
                />
              )}
            </div>
          </div>
          <ButtonGroup>
            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant="solid"
              onClick={() => {
                onAdd();
              }}
            >
              Tambah Gudang
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default NewWarehouse;
