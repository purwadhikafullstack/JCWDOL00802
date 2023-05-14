import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Text, Textarea, Input, Image } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";
import { API_URL } from "../helper";
import { ButtonGroup } from "reactstrap";
const EditPromo = () => {
  const navigate = useNavigate();
  let userToken = localStorage.getItem("cnc_login");
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  //STATE
  const [kode, setKode] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [maxPromo, setMaxPromo] = useState(0);
  const [limitPromo, setLimitPromo] = useState();
  const [statusPromo, setStatusPromo] = useState();
  const [expirePromo, setExpirePromo] = useState();
  const [dataCategory, setDataCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [promoPicture, setPromoPicture] = useState("");
  const [cpu, setCpu] = useState(0);
  const [checker, setChecker] = useState([]);

  //FORMIK
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      promoCode: kode,
      promoDescription: deskripsi,
      promoMax: maxPromo,
      promoLimit: limitPromo,
      count: cpu,
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
      if (!promo.data) {
        setChecker(null);
      } else {
        setChecker(["1"]);
        setKode(promo.data.promo_code);
        setDeskripsi(promo.data.description);
        setMaxPromo(promo.data.max_count);
        setLimitPromo(promo.data.limitation);
        setStatusPromo(promo.data.status);
        setPreview(`${API_URL}/img/promo/${promo.data.promo_picture}`);
        setPromoPicture(promo.data.promo_picture);
        setExpirePromo(promo.data.expire_date.split("T")[0]);
        setCpu(promo.data.count_user);
        setSelectedCategory(promo.data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
    });
  };

  useEffect(() => {
    getPromo();
  }, []);

  useEffect(() => {
    getCategory();
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
          category: selectedCategory,
          count_user: values.count,
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

  const onMail = async () => {
    try {
      await Axios.post(
        API_URL + `/apis/promo/emailpromo`,
        {
          id_promo: idPromo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      ).then((response) => {
        alert("Email to subs Success ✅");
        navigate("/admin/promo");
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  // PRINT
  const printCategory = () => {
    let data = dataCategory;

    if (dataCategory) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.id_category}
            selected={val.id_category == selectedCategory}
          >
            {val?.category}
          </option>
        );
      });
    }
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Detail Promo";
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
    } else if (!checker && role == 3) {
      navigate("/admin/promo");
    }
  }, [checker, role, userToken]);
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

          <div className="my-3 d-flex">
            <div className="mx-2">
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
            <div className="mx-2">
              <label className="form-label fw-bold text-muted">
                Promo max per user
              </label>
              <Input
                id="count"
                type="number"
                className={errors.count && touched.count ? "input-error" : ""}
                placeholder="Promo Max"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.count}
              />
              {errors.count && touched.count && (
                <Text fontSize="small" className="error">
                  {errors.count}
                </Text>
              )}
            </div>
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
              className="form-control"
            >
              <option value={0} selected={statusPromo == 0}>
                Not Active
              </option>
              <option value={1} selected={statusPromo == 1}>
                Active
              </option>
            </select>
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Kategori</label>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control"
            >
              <option value={0}>Select Category</option>
              {printCategory()}
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
            <ButtonGroup>
              <Button
                type="button"
                colorScheme="orange"
                variant={buttonDisabled ? "outline" : "solid"}
                isDisabled={buttonDisabled}
                onClick={() => onEdit()}
              >
                Edit Promo
              </Button>
              <Button
                type="button"
                colorScheme="orange"
                onClick={() => onMail()}
                className="mx-2"
              >
                Send Email to Subs
              </Button>
            </ButtonGroup>
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
