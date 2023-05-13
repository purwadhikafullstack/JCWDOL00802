import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button, Text, Textarea, Input } from "@chakra-ui/react";
import { API_URL } from "../helper";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";
import { useSelector } from "react-redux";

const NewWarehouse = (props) => {
  const navigate = useNavigate();
  let userToken = localStorage.getItem("cnc_login");
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  //STATE
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      warehouseName: "",
      warehouseAddress: "",
      phone: "",
    },
    validationSchema: basicSchema,
  });

  const [keyProvinceEdit, setKeyProvinceEdit] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinceList, setProvinceList] = useState(null);
  const [cityList, setCityList] = useState(null);

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

  // USE EFFECT
  useEffect(() => {
    onGetProvince();
  }, []);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    if (
      errors.warehouseName ||
      errors.warehouseAddress ||
      errors.phone ||
      selectedCity == null
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors, selectedCity]);

  useEffect(() => {
    if (touched.warehouseName || touched.warehouseAddress || touched.phone) {
      setFirstLaunch(false);
    }
  }, [touched]);

  //PRINT DATA
  const printDataProvince = () => {
    let data = provinceList ? provinceList : [];
    return data.map((val, idx) => {
      return <option value={val.province_id}>{val.province}</option>;
    });
  };

  const printDataCity = () => {
    let data = cityList ? cityList : [];
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
    let getLocalStorage = localStorage.getItem("cnc_login");
    let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
    Axios.post(
      API_URL + `/apis/warehouse/addwarehouse`,
      {
        warehouse_branch_name: values.warehouseName,
        phone_number: values.phone,
        city: selectedCity?.city_name,
        province: selectedCity?.province,
        postal_code: selectedCity?.postal_code,
        detail_address: values.warehouseAddress,
        key_city: selectedCity?.city_id,
        key_province: selectedCity?.province_id,
        date: tanggal,
      },
      { headers: { Authorization: `Bearer ${getLocalStorage}` } }
    )
      .then((response) => {
        alert("Add Warehouse Success ✅");
        navigate("/admin/warehouse");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.msg);
      });
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Tambah Gudang";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);
  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    } else if (role && role == 1) {
      navigate("/");
    } else if (role && role == 2) {
      navigate("/admin");
    }
  }, [role, userToken]);
  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };

  //SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="paddingmain">
      <div>
        <Text fontSize="2xl">Add Warehouse</Text>
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
              type="tel"
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
          <div className="my-3 ">
            <label className="form-label fw-bold text-muted">Propinsi</label>
            <select
              onChange={(e) => onGetCity(e.target.value)}
              className="form-control"
            >
              <option>Pilih Propinsi</option>
              {printDataProvince()}
            </select>
          </div>
          <div className="my-3 ">
            <label className="form-label fw-bold text-muted">Kota</label>
            <select
              onChange={(e) => onGetPostal(e.target.value)}
              className="form-control"
            >
              <option>Pilih Kota</option>
              {printDataCity()}
            </select>
          </div>
          <div className="my-3 ">
            <label className="form-label fw-bold text-muted">Postal Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Kode pos"
              value={selectedCity?.postal_code}
              disabled
            />
          </div>
          <Button
            type="button"
            colorScheme="orange"
            variant={firstLaunch || buttonDisabled ? "outline" : "solid"}
            isDisabled={firstLaunch || buttonDisabled}
            onClick={() => {
              onAdd();
            }}
          >
            Tambah Gudang
          </Button>
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

export default NewWarehouse;
