import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Text, Textarea, Input, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useFormik } from "formik";
import { API_URL } from "../helper";
import { basicSchema } from "../schemas";

const NewPromo = (props) => {
  const navigate = useNavigate();
  // STATE

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      promoCode: "",
      promoDescription: "",
      promoMax: null,
      promoLimit: null,
    },
    validationSchema: basicSchema,
  });

  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [promoPicture, setPromoPicture] = useState("");
  const [expire, setExpire] = useState(null);

  //GAMBAR
  const loadPromoPictureEdit = (e) => {
    const image = e.target.files[0];
    setPromoPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  //AXIOS FUNCTION
  const onAdd = () => {
    Axios.post(
      API_URL + `/apis/promo/addpromo`,
      {
        promo_code: values.promoCode,
        description: values.promoDescription,
        max_count: values.promoMax,
        promo_picture: promoPicture,
        expire_date: expire,
        limitation: values.promoLimit,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => {
        alert("Add Promo Success ✅");
        navigate("/admin/promo");
      })
      .catch((error) => {
        console.log(error);
        alert("Add Promo Fail");
      });
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    if (
      errors.promoCode ||
      errors.promoDescription ||
      errors.promoMax ||
      errors.promoLimit ||
      promoPicture == ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors, promoPicture]);

  useEffect(() => {
    if (
      touched.promoCode ||
      touched.promoDescription ||
      touched.promoMax ||
      touched.promoLimit
    ) {
      setFirstLaunch(false);
    }
  }, [touched]);

  return (
    <div className="paddingmain">
      <Text fontSize="2xl">Add Promo</Text>
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
              onChange={(e) => setExpire(e.target.value)}
            />
          </div>
        </div>
        <div className="col-6 px-5">
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
            <Button
              type="button"
              colorScheme="orange"
              variant={firstLaunch || buttonDisabled ? "outline" : "solid"}
              isDisabled={firstLaunch || buttonDisabled}
              onClick={() => onAdd()}
            >
              Add Promo
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

export default NewPromo;
