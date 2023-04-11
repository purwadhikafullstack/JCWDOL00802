import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, ButtonGroup, Image, Text, Textarea } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../helper";
const EditProduct = (props) => {
  const navigate = useNavigate();
  // AMBIL DATA ROLE UTK DISABLE BUTTON EDIT KALO BUKAN SUPERADMIN
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (role === 3) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [role]);

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

  // GET NOMOR ID PRODUK DARI QUERY
  const location = useLocation();
  let idProd = location.search.split("=")[1];

  //FUNCTION FE
  const getProduct = async () => {
    try {
      let products = await Axios.get(API_URL + `/apis/product/detailproduct`, {
        params: { id_product: idProd },
      });
      setDataProduct(products.data);
      setIdEdit(products.data.id_product);
      setNameEdit(products.data.name);
      setDescriptionEdit(products.data.description);
      setPriceEdit(products.data.price);
      setWeightEdit(products.data.weight);
      setPreview(`${API_URL}/img/product/${products.data.product_picture}`);
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

  //GAMBAR
  const loadProfilePictureEdit = (e) => {
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
    getStock();
  }, [dataWarehouse]);

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

  return (
    <div className="bg-white  w-100 p-3 m-auto ">
      <Text className="ps-4 pt-3" fontSize="4xl">
        {" "}
        Edit Product
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
            <div className="my-3 col-6 ">
              <label className="form-label fw-bold text-muted">Price</label>
              <input
                type="text"
                className="form-control p-3"
                placeholder=""
                onChange={(e) => setPriceEdit(e.target.value)}
                value={priceEdit}
                disabled={!isEdit}
              />
            </div>
            <div className="my-3 col-6">
              <label className="form-label fw-bold text-muted">
                Berat Barang (gram)
              </label>
              <input
                type="text"
                className="form-control p-3"
                placeholder=""
                onChange={(e) => setWeightEdit(e.target.value)}
                value={weightEdit}
                disabled={!isEdit}
              />
            </div>
          </div>

          {/* INPUT PICTURE */}
          <div>
            <label className="form-label fw-bold text-muted">
              Gambar Produk
            </label>
            <div>
              {preview ? (
                <Image className="img-thumbnail" src={preview} alt="" />
              ) : (
                <img src={productPicture} className="img-thumbnail" alt="" />
              )}
            </div>
            {isEdit && (
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
                {role == 3 && <option>Pilih Gudang</option>}
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
