import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Text, Textarea, Input, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useFormik } from "formik";
import { API_URL } from "../helper";
import { basicSchema } from "../schemas";
import { useSelector } from "react-redux";

const NewProduct = (props) => {
  const navigate = useNavigate();
  let userToken = localStorage.getItem("cnc_login");
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  // STATE
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      productName: "",
      productDescription: "",
      price: "",
      weight: "",
    },
    validationSchema: basicSchema,
  });

  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [productPicture, setProductPicture] = useState("");
  const [dataCategory, setDataCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
    });
  };

  //GAMBAR
  const loadProductPictureEdit = (e) => {
    const image = e.target.files[0];
    setProductPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  //AXIOS FUNCTION
  const onAdd = () => {
    let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
    Axios.post(
      API_URL + `/apis/product/addproduct`,
      {
        name: values.productName,
        description: values.productDescription,
        price: values.price,
        weight: values.weight,
        product_picture: productPicture,
        id_category: selectedCategory,
        date: tanggal,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => {
        alert("Add Product Success ✅");
        navigate("/admin/products");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.msg);
      });
  };

  //USE EFFECT
  useEffect(() => {
    getCategory();
  }, []);

  //PRINT DATA
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

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    if (
      errors.productName ||
      errors.productDescription ||
      errors.price ||
      errors.weight ||
      productPicture == ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors, productPicture]);

  useEffect(() => {
    if (
      touched.productName ||
      touched.productDescription ||
      touched.price ||
      touched.weight
    ) {
      setFirstLaunch(false);
    }
  }, [touched]);

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Tambah Produk";
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
      <Text fontSize="2xl">Add Product</Text>
      <div className="d-flex">
        <div className="col-6 px-5">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Nama</label>
            <Input
              type="text"
              id="productName"
              placeholder="Nama Produk"
              value={values.productName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.productName && touched.productName ? "input-error" : ""
              }
            />
            {errors.productName && touched.productName && (
              <Text fontSize="small" className="error">
                {errors.productName}
              </Text>
            )}
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Description</label>
            <Textarea
              id="productDescription"
              type="text"
              className={
                errors.productDescription && touched.productDescription
                  ? "input-error"
                  : ""
              }
              placeholder="DESC"
              style={{
                resize: "none",
                height: "250px",
              }}
              value={values.productDescription}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.productDescription && touched.productDescription && (
              <Text fontSize="small" className="error">
                {errors.productDescription}
              </Text>
            )}
          </div>
          <div className="my-3 row">
            <div className="col-3 ">
              <label className="form-label fw-bold text-muted">Harga</label>
              <Input
                id="price"
                type="number"
                className={errors.price && touched.price ? "input-error" : ""}
                placeholder="Rp."
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.price}
              />
              {errors.price && touched.price && (
                <Text fontSize="small" className="error">
                  {errors.price}
                </Text>
              )}
            </div>
            <div className="col-3 ">
              <label className="form-label fw-bold text-muted">Berat</label>
              <Input
                id="weight"
                type="number"
                className={errors.weight && touched.weight ? "input-error" : ""}
                placeholder="Berat Barang (gram)"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.weight}
              />
              {errors.weight && touched.weight && (
                <Text fontSize="small" className="error">
                  {errors.weight}
                </Text>
              )}
            </div>
            <div className=" col-6">
              <label className="form-label fw-bold text-muted">Kategori</label>
              <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control"
              >
                <option value={0}>Select Category</option>
                {printCategory()}
              </select>
            </div>
          </div>
        </div>
        <div className="col-6 px-5">
          <div>
            <label className="form-label fw-bold text-muted">
              Gambar Produk
            </label>
            <div>
              {preview ? (
                <Image
                  className="img-thumbnail"
                  src={preview}
                  alt=""
                  style={{
                    height: "200px",
                    width: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={productPicture}
                  className="img-thumbnail"
                  alt=""
                  style={{
                    height: "200px",
                    width: "200px",
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
                onChange={loadProductPictureEdit}
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
              Add Product
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

export default NewProduct;
