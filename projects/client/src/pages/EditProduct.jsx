import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, ButtonGroup, Image, Text, Textarea } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../helper";
const EditProduct = (props) => {
  const navigate = useNavigate();

  //STATE
  const [idEdit, setIdEdit] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [priceEdit, setPriceEdit] = useState("");
  const [weightEdit, setWeightEdit] = useState("");
  const [inputChange, setInputChange] = useState("");
  const [notes, setNotes] = useState("");
  const [dataProduct, setDataProduct] = useState(null);
  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [productPicture, setProductPicture] = useState("");
  const [gudang, setGudang] = useState("");
  const [type, setType] = useState("");
  const [dataWarehouse, setDataWarehouse] = useState(null);
  const [dataStock, setDataStock] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [dataCategory, setDataCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  // GET NOMOR ID PRODUK DARI QUERY
  const location = useLocation();
  let idProd = location.search.split("=")[1];

  //FUNCTION FE
  const getProduct = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    try {
      let products = await Axios.get(API_URL + `/apis/product/detailproduct`, {
        params: { id_product: idProd },
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      });
      setDataProduct(products.data.data);
      setIdEdit(products.data.data.id_product);
      setNameEdit(products.data.data.name);
      setDescriptionEdit(products.data.data.description);
      setPriceEdit(products.data.data.price);
      setWeightEdit(products.data.data.weight);
      setProductPicture(products.data.data.product_picture);
      setSelectedCategory(products.data.data.Category_Products[0].id_category);
      setPreview(
        `${API_URL}/img/product/${products.data.data.product_picture}`
      );
      setIsEdit(products.data.edit);
    } catch (error) {
      console.log(error);
    }
  };

  const getWarehouse = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehouse`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setDataWarehouse(response.data);
    });
  };

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

  // FUNCTION AXIOS
  const onEdit = () => {
    Axios.post(
      API_URL + `/apis/product/editproduct`,
      {
        id_product: idEdit,
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
        alert("Edit Product Success ✅");
        navigate("/admin/products");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = () => {
    Axios.post(API_URL + `/apis/product/deleteproduct`, {
      id_product: dataProduct.id_product,
    })
      .then((response) => {
        alert("Delete Product Success ✅");
        navigate("/admin/products");
      })
      .catch((error) => {
        console.log(error);
        // alert(error.response.data.msg);
      });
  };

  const onExecuteChange = () => {
    Axios.post(API_URL + `/stock/stockedit`, {
      input: inputChange,
      id_product: idEdit,
      id_warehouse: gudang,
      type,
    })
      .then((response) => {
        alert("Edit Stock Success ✅");
        navigate("/admin/products");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //USE EFFECT
  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    getWarehouse();
  }, []);
  useEffect(() => {
    getCategory();
  }, []);

  //PRINT DATA
  const printSelectWarehouse = () => {
    let data = dataWarehouse;
    if (dataWarehouse) {
      return data.map((val, idx) => {
        if (val.status == 2 || val.status == 1) {
          return (
            <option
              value={val?.id_warehouse}
              selected={val.id_warehouse == selectedWarehouse}
            >
              {val?.warehouse_branch_name}
            </option>
          );
        }
      });
    }
  };

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
    <div className="bg-white  w-100 p-3 m-auto ">
      <Text className="ps-4 pt-3" fontSize="4xl">
        Detail Product
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
              disabled={!isEdit}
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
              disabled={!isEdit}
            />
          </div>
          <div className="flex row">
            <div className="my-3 col-3 ">
              <label className="form-label fw-bold text-muted">Harga</label>
              <input
                type="text"
                className="form-control p-3"
                placeholder="Rp."
                onChange={(e) => setPriceEdit(e.target.value)}
                value={priceEdit}
                disabled={!isEdit}
              />
            </div>
            <div className="my-3 col-3">
              <label className="form-label fw-bold text-muted">Berat</label>
              <input
                type="text"
                className="form-control p-3"
                placeholder="Berat Barang (gram)"
                onChange={(e) => setWeightEdit(e.target.value)}
                value={weightEdit}
                disabled={!isEdit}
              />
            </div>
            <div className=" col-6">
              <label className="form-label fw-bold text-muted">Kategori</label>
              <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control form-control-lg mt-3"
                disabled={!isEdit}
              >
                <option value={0}>Select Category</option>
                {printCategory()}
              </select>
            </div>
          </div>

          {/* INPUT PICTURE */}
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
                    height: "300px",
                    width: "300px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={productPicture}
                  className="img-thumbnail"
                  alt=""
                  style={{
                    height: "300px",
                    width: "300px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            {isEdit && (
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
            )}
          </div>
          {/*  */}
          <br />
          <ButtonGroup>
            {isEdit && (
              <Button
                type="button"
                width="full"
                colorScheme="orange"
                variant="solid"
                onClick={onEdit}
              >
                Simpan
              </Button>
            )}
            {isEdit && (
              <Button
                type="button"
                width="full"
                colorScheme="orange"
                variant="solid"
                onClick={onDelete}
              >
                Hapus Produk
              </Button>
            )}
            <Link to="/admin/products">
              <Button>Kembali</Button>
            </Link>
          </ButtonGroup>
        </div>
        <div className="col-6 px-5">
          <div className="row bg-white">
            <div>
              <label className="form-label fw-bold text-muted">Warehouse</label>
              <select
                className="form-control form-control-lg mt-3"
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                {isEdit && <option>Pilih Gudang</option>}
                {printSelectWarehouse()}
              </select>
              <label className="form-label fw-bold text-muted">Stock</label>
              <input
                type="text"
                className="form-control p-3"
                placeholder="jmlh stok"
                value={dataStock}
                disabled
              />
            </div>

            <div className="my-5">
              <label className="form-label fw-bold text-muted">
                INPUT CHANGE JUMLAH STOK
              </label>
              <input
                type="text"
                className="form-control p-3"
                placeholder="INPUT CHANGE HERE"
                value={inputChange}
                onChange={(e) => setInputChange(e.target.value)}
              />
              <br />
              <label className="form-label fw-bold text-muted">
                TIPE PERUBAHAN
              </label>
              <select
                className="form-control form-control-lg mt-3"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" selected hidden>
                  Pilih tipe
                </option>
                <option value="increment">INPUT BARANG</option>
                <option value="decrement">BUANG BARANG</option>
              </select>
              <br />
              <label className="form-label fw-bold text-muted">
                Notes for changes
              </label>
              <Textarea
                type="text"
                className="form-control p-3"
                placeholder="DESC"
                style={{
                  resize: "none",
                  height: "100px",
                }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <ButtonGroup>
              <Button
                type="button"
                width="full"
                colorScheme="orange"
                variant="solid"
                onClick={onExecuteChange}
              >
                EXECUTE INPUT
              </Button>
            </ButtonGroup>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
