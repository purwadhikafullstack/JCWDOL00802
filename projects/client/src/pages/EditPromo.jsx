import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import {
  Button,
  ButtonGroup,
  Text,
  Textarea,
  Input,
  Image,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";

import { API_URL } from "../helper";
const EditPromo = (props) => {
  const navigate = useNavigate();

  //STATE
  const [kode, setKode] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [maxPromo, setMaxPromo] = useState(0);
  const [limitPromo, setLimitPromo] = useState();
  const [statusPromo, setStatusPromo] = useState();
  const [expirePromo, setExpirePromo] = useState();

  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [promoPicture, setPromoPicture] = useState("");

  //FORMIK
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      promoCode: kode,
      promoDescription: deskripsi,
      promoMax: maxPromo,
      promoLimit: limitPromo,
    },
    enableReinitialize: true,
    validationSchema: basicSchema,
  });

  //GAMBAR
  const loadPromoPictureEdit = (e) => {
    const image = e.target.files[0];
    setPromoPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  //GET ID Promo
  const location = useLocation();
  const idPromo = location.search.split("=")[1];

  // GET DATA
  const getPromo = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    try {
      let promo = await Axios.get(API_URL + `/apis/promo/detailpromo`, {
        params: { id_promo: idPromo },
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      });
      setKode(promo.data[0].promo_code);
      setDeskripsi(promo.data[0].description);
      setMaxPromo(promo.data[0].max_count);
      setLimitPromo(promo.data[0].limitation);
      setStatusPromo(promo.data[0].status);
      setPreview(`${API_URL}/img/promo/${promo.data[0].promo_picture}`);
      setExpirePromo(promo.data[0].expire_date.split("T")[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromo();
  }, []);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      errors.promoCode ||
      errors.promoDescription ||
      errors.promoMax ||
      errors.promoLimit
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors]);

  //PRINT DATA

  //FUNCTION BUTTON
  const onEdit = async () => {
    try {
      await Axios.post(
        API_URL + `/apis/promo/editpromo`,
        {
          id_promo: idPromo,
          promo_code: values.promoCode,
          description: values.promoDescription,
          max_count: values.promoMax,
          promo_picture: promoPicture,
          expire_date: expirePromo,
          limitation: values.promoLimit,
          status: statusPromo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      ).then((response) => {
        alert("Edit promo Success ✅");
        navigate("/admin/promo");
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="paddingmain">
      <Text fontSize="2xl">Edit Promo</Text>
      <div className="d-flex">
        <div className="col-6 px-5">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Promo Code</label>
            <Input
              type="text"
              id="promoCode"
              placeholder="Promo Code"
              value={values.promoCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.promoCode && touched.promoCode ? "input-error" : ""
              }
            />
            {errors.promoCode && touched.promoCode && (
              <Text fontSize="small" className="error">
                {errors.promoCode}
              </Text>
            )}
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Description</label>
            <Textarea
              id="promoDescription"
              type="text"
              className={
                errors.promoDescription && touched.promoDescription
                  ? "input-error"
                  : ""
              }
              placeholder="DESC"
              style={{
                resize: "none",
                height: "250px",
              }}
              value={values.promoDescription}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.promoDescription && touched.promoDescription && (
              <Text fontSize="small" className="error">
                {errors.promoDescription}
              </Text>
            )}
          </div>

          <div className="my-3">
            <label className="form-label fw-bold text-muted">Promo max</label>
            <Input
              id="promoMax"
              type="number"
              className={
                errors.promoMax && touched.promoMax ? "input-error" : ""
              }
              placeholder="Promo Max"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.promoMax}
            />
            {errors.promoMax && touched.promoMax && (
              <Text fontSize="small" className="error">
                {errors.promoMax}
              </Text>
            )}
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">
              Minimal Pembelanjaan
            </label>
            <Input
              id="promoLimit"
              type="number"
              className={
                errors.promoLimit && touched.promoLimit ? "input-error" : ""
              }
              placeholder="Rp."
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.promoLimit}
            />
            {errors.promoLimit && touched.promoLimit && (
              <Text fontSize="small" className="error">
                {errors.promoLimit}
              </Text>
            )}
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Expiry date</label>
            <Input
              placeholder="Select Date"
              size="md"
              type="date"
              value={expirePromo}
              onChange={(e) => setExpirePromo(e.target.value)}
            />
          </div>
        </div>
        <div className="col-6 px-5">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Status</label>
            <select
              onChange={(e) => setStatusPromo(e.target.value)}
              className="form-control  "
            >
              <option value={0} selected={statusPromo == 0}>
                Not Active
              </option>
              <option value={1} selected={statusPromo == 1}>
                Active
              </option>
            </select>
          </div>
          <div>
            <label className="form-label fw-bold text-muted">
              Gambar Promo
            </label>
            <div>
              {preview ? (
                <Image
                  className="img-thumbnail"
                  src={preview}
                  alt=""
                  style={{
                    height: "200px",
                    width: "350px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={promoPicture}
                  className="img-thumbnail"
                  alt=""
                  style={{
                    height: "200px",
                    width: "350px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div className="my-3">
              <label htmlFor="formFile" className="form-label">
                Upload image here
              </label>
              <input
                onChange={loadPromoPictureEdit}
                className="form-control"
                type="file"
                id="formFile"
              />
            </div>
          </div>
          <div>
            <Button
              type="button"
              colorScheme="orange"
              variant={buttonDisabled ? "outline" : "solid"}
              isDisabled={buttonDisabled}
              onClick={() => onEdit()}
            >
              Edit Promo
            </Button>

            {buttonDisabled && (
              <Text fontSize="small" className="error">
                Please complete the form
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPromo;
