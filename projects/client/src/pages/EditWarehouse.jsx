import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { Button, ButtonGroup, Text, Textarea, Input } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";

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

  //FORMIK
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      warehouseName: nameEdit,
      warehouseAddress: detailAddressEdit,
      phone: phoneNumberEdit,
    },
    enableReinitialize: true,
    validationSchema: basicSchema,
  });

  //GET ID WAREHOUSE
  const location = useLocation();
  const idWarehouse = location.search.split("=")[1];

  // GET DATA
  const getWarehouse = async () => {
    try {
      let warehouse = await Axios.get(
        API_URL + `/apis/warehouse/detailwarehouse?id_warehouse=${idWarehouse}`
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
        API_URL + `/apis/warehouse/postal?postal=${warehouseData.postal_code}`
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
      let response = await Axios.get(API_URL + `/apis/rajaongkir/getprovince`);
      setProvinceList(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [keyProvinceEdit]);

  const onGetCity = useCallback(
    async (idprop) => {
      try {
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
        setCityList(kota);
      } catch (error) {
        console.log(error);
      }
    },
    [keyProvinceEdit]
  );

  // USE EFFECT
  useEffect(() => {
    onGetProvince();
  }, [onGetProvince]);
  useEffect(() => {
    getWarehouse();
  }, []);
  useEffect(() => {
    onGetSelectedCity();
  }, [warehouseData]);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (errors.warehouseName || errors.warehouseAddress || errors.phone) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors]);

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
      let getLocalStorage = localStorage.getItem("cnc_login");
      await Axios.post(
        API_URL + `/apis/warehouse/editwarehouse`,
        {
          id_warehouse: idWarehouse,
          warehouse_branch_name: values.warehouseName,
          phone_number: values.phone,
          city: selectedCity?.city_name,
          province: selectedCity?.province,
          postal_code: selectedCity?.postal_code,
          detail_address: values.warehouseAddress,
          key_city: selectedCity?.city_id,
          key_province: selectedCity?.province_id,
        },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      ).then((response) => {
        alert("Edit Warehouse Success ✅");
        navigate("/admin/warehouse");
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  const onDelete = () => {
    let text = `Apa anda mau hapus gudang ${nameEdit}`;
    if (window.confirm(text) == true) {
      let getLocalStorage = localStorage.getItem("cnc_login");
      Axios.post(
        API_URL + `/apis/warehouse/deletewarehouse`,
        {
          id_warehouse: idWarehouse,
        },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      )
        .then((response) => {
          alert("Delete Warehouse Success ✅");
          navigate("/admin/warehouse");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="bg-white w-100 m-auto">
      <div>
        <Text fontSize="2xl">Edit Warehouse</Text>
      </div>
      <div className="d-flex">
        <div className="col-6 p-3">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Nama Warehouse
            </label>
            <Input
              type="text"
              id="warehouseName"
              placeholder="Nama Gudang"
              value={values.warehouseName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.warehouseName && touched.warehouseName
                  ? "input-error"
                  : ""
              }
            />
            {errors.warehouseName && touched.warehouseName && (
              <Text fontSize="small" className="error">
                {errors.warehouseName}
              </Text>
            )}
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Nomor Telepon
            </label>
            <Input
              type="text"
              id="phone"
              placeholder="Nomor Telepon"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.phone && touched.phone ? "input-error" : ""}
            />
            {errors.phone && touched.phone && (
              <Text fontSize="small" className="error">
                {errors.phone}
              </Text>
            )}
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Alamat Warehouse
            </label>
            <Textarea
              id="warehouseAddress"
              type="text"
              className={
                errors.warehouseAddress && touched.warehouseAddress
                  ? "input-error"
                  : ""
              }
              placeholder="Alamat Lengkap"
              style={{
                resize: "none",
                height: "150px",
              }}
              value={values.warehouseAddress}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.warehouseAddress && touched.warehouseAddress && (
              <Text fontSize="small" className="error">
                {errors.warehouseAddress}
              </Text>
            )}
          </div>
        </div>
        <div className="col-6 p-3">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Propinsi</label>
            <select
              onChange={(e) => onGetCity(e.target.value)}
              className="form-control form-control-lg"
            >
              <option value={selectedCity?.province_id}>
                {selectedCity?.province}
              </option>
              {printDataProvince()}
            </select>
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Kota</label>
            <select
              onChange={(e) => onGetPostal(e.target.value)}
              className="form-control form-control-lg"
            >
              <option value={selectedCity?.city_id}>
                {selectedCity?.city_name}
              </option>
              {printDataCity()}
            </select>
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Postal Code</label>
            <input
              type="text"
              className="form-control p-3"
              placeholder="Kode pos"
              value={selectedCity?.postal_code}
              disabled
            />
          </div>
          <ButtonGroup>
            <Button
              type="button"
              colorScheme="orange"
              variant={buttonDisabled ? "outline" : "solid"}
              onClick={() => onEdit()}
              isDisabled={buttonDisabled}
            >
              Simpan
            </Button>
            <Button
              type="button"
              colorScheme="orange"
              variant="solid"
              onClick={() => onDelete()}
            >
              Hapus Gudang
            </Button>
            <Link to="/admin/warehouse">
              <Button>Kembali</Button>
            </Link>
          </ButtonGroup>
          {buttonDisabled && (
            <Text fontSize="small" className="error">
              Please complete the form
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditWarehouse;
