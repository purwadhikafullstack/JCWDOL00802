import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, ButtonGroup, Text, Textarea } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../helper";
const NewProduct = (props) => {
  const navigate = useNavigate();
  // STATE
  const [nameEdit, setNameEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [priceEdit, setPriceEdit] = useState("");
  const [weightEdit, setWeightEdit] = useState("");
  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [productPicture, setProductPicture] = useState("");
  const [dataCategory, setDataCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
    });
  };

  //GAMBAR
  const loadProfilePictureEdit = (e) => {
    const image = e.target.files[0];
    setProductPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  //AXIOS FUNCTION
  const onAdd = () => {
    Axios.post(
      API_URL + `/apis/product/addproduct`,
      {
        name: nameEdit,
        description: descriptionEdit,
        price: priceEdit,
        weight: weightEdit,
        product_picture: productPicture,
        id_category: selectedCategory,
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
        // alert(error.response.data.msg);
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

  return (
    <div>
      <Text className="ps-4 pt-3" fontSize="4xl">
        Add Product
      </Text>
      <div id="regispage" className="row">
        <div className="col-6 px-5">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Nama</label>
            <input
              type="text"
              className="form-control p-3"
              placeholder="NAMA PRODUK"
              value={nameEdit}
              onChange={(e) => setNameEdit(e.target.value)}
            />
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Description</label>
            <Textarea
              type="text"
              className="form-control p-3"
              placeholder="DESC"
              style={{
                resize: "none",
                height: "250px",
              }}
              value={descriptionEdit}
              onChange={(e) => setDescriptionEdit(e.target.value)}
            />
          </div>
          <div className="my-3 row">
            <div className="col-3 ">
              <label className="form-label fw-bold text-muted">Harga</label>
              <input
                type="text"
                className="form-control p-3"
                placeholder="Rp."
                onChange={(e) => setPriceEdit(e.target.value)}
                value={priceEdit}
              />
            </div>
            <div className="col-3 ">
              <label className="form-label fw-bold text-muted">Berat</label>
              <input
                type="text"
                className="form-control p-3"
                placeholder="Berat Barang (gram)"
                onChange={(e) => setWeightEdit(e.target.value)}
                value={weightEdit}
              />
            </div>
            <div className=" col-6">
              <label className="form-label fw-bold text-muted">Kategori</label>
              <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option value={0}>Select Category</option>
                {printCategory()}
              </select>
            </div>
          </div>
        </div>
        <div className="col-6 px-5">
          <div className="row bg-white">
            <div>
              <label className="form-label fw-bold text-muted">
                Gambar Produk
              </label>
              <div>
                {preview ? (
                  <img className="img-thumbnail" src={preview} alt="" />
                ) : (
                  <img src={productPicture} className="img-thumbnail" alt="" />
                )}
              </div>
              <div className="my-3">
                <label htmlFor="formFile" className="form-label">
                  Upload image here
                </label>
                <input
                  onChange={loadProfilePictureEdit}
                  className="form-control"
                  type="file"
                  id="formFile"
                />
              </div>
            </div>
          </div>
          <ButtonGroup>
            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant="solid"
              onClick={onAdd}
            >
              Add Product
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
