import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Image,
  Text,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";
import { API_URL } from "../helper";
const EditProduct = () => {
  const navigate = useNavigate();
  let userToken = localStorage.getItem("cnc_login");
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  //STATE PRODUCT
  const [idEdit, setIdEdit] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [priceEdit, setPriceEdit] = useState("");
  const [weightEdit, setWeightEdit] = useState("");
  const [preview, setPreview] = useState("https://fakeimg.pl/350x200/");
  const [productPicture, setProductPicture] = useState("");
  const [dataCategory, setDataCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  //STATE STOCK
  const [dataWarehouse, setDataWarehouse] = useState(null);
  const [dataStock, setDataStock] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  //INCREMENT-DECREMENT STOCK
  const [showChange, setShowChange] = useState(false);
  const [type, setType] = useState("");
  const [inputChange, setInputChange] = useState("");
  const [notes, setNotes] = useState("");

  //REQUEST STOCK
  const [showRequest, setShowRequest] = useState(false);
  const [dataWarehouseFrom, setDataWarehouseFrom] = useState(null);
  const [idWarehouseFrom, setIdWarehouseFrom] = useState("");
  const [stockWarehouseFrom, setStockWarehouseFrom] = useState("");

  //FORMIK
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      productName: nameEdit,
      productDescription: descriptionEdit,
      price: priceEdit,
      weight: weightEdit,
    },
    enableReinitialize: true,
    validationSchema: basicSchema,
  });

  // GET NOMOR ID PRODUK DARI QUERY
  const [productChecker, setProductChecker] = useState([]);
  const location = useLocation();
  let idProd = location.search.split("=")[1];

  //FUNCTION FE

  //DETAIL PRODUK
  const getProduct = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    try {
      let products = await Axios.get(API_URL + `/apis/product/detailproduct`, {
        params: { id_product: idProd, warehouse: selectedWarehouse },
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      });
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
      setDataStock(products.data.data.stock);
      if (!products.data.data.id_product) {
        setProductChecker(null);
      } else {
        setProductChecker(["1"]);
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

  const getWarehouse = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehouse`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setDataWarehouse(response.data);
      setSelectedWarehouse(response.data[0].id_warehouse);
    });
  };

  const getWarehouseFrom = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(`${API_URL}/apis/product/warehousefrom?id=${selectedWarehouse}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorage}`,
      },
    }).then((response) => {
      setDataWarehouseFrom(response.data);
    });
  };

  const getStockFrom = async () => {
    let getLocalStorage = localStorage.getItem("cnc_login");
    Axios.get(
      `${API_URL}/apis/product/stockfrom?warehouse=${idWarehouseFrom}&product=${idProd}`,
      {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      }
    ).then((response) => {
      setStockWarehouseFrom(response.data.stock);
    });
  };

  //GAMBAR
  const loadProductPictureEdit = (e) => {
    const image = e.target.files[0];
    setProductPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  //SHOWTAB
  const resetChange = () => {
    if (showChange == false) {
      setInputChange("");
      setNotes("");
    }
  };

  const resetRequest = () => {
    if (showRequest == false) {
      setInputChange("");
      setNotes("");
    }
  };

  useEffect(() => {
    resetChange();
  }, [showChange]);

  useEffect(() => {
    resetRequest();
  }, [showRequest]);

  const showChangeButton = () => {
    if (showChange == true) {
      setShowChange(false);
    } else if (showChange == false) {
      setShowChange(true);
      setShowRequest(false);
    }
  };

  const showRequestButton = () => {
    if (showRequest == true) {
      setShowRequest(false);
    } else if (showRequest == false) {
      setShowRequest(true);
      setShowChange(false);
    }
  };

  // FUNCTION AXIOS
  const onEdit = () => {
    Axios.post(
      API_URL + `/apis/product/editproduct`,
      {
        id_product: idEdit,
        name: values.productName,
        description: values.productDescription,
        price: values.price,
        weight: values.weight,
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
        alert(error.response.data.msg);
      });
  };

  const onDelete = () => {
    let text = `Apa anda mau hapus produk ${nameEdit}`;
    if (window.confirm(text) == true) {
      Axios.post(
        API_URL + `/apis/product/deleteproduct`,
        {
          id_product: idEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      )
        .then((response) => {
          alert("Delete Product Success ✅");
          navigate("/admin/products");
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.msg);
        });
    }
  };

  const onExecuteChange = () => {
    let input = parseInt(inputChange);
    if (type == "decrement" && input > dataStock) {
      alert("jumlah barang melebihi stok");
    } else {
      let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
      Axios.post(
        API_URL + `/apis/product/stockedit`,
        {
          input,
          id_product: idEdit,
          id_warehouse: selectedWarehouse,
          type,
          note: notes,
          date: tanggal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      )
        .then((response) => {
          alert("Edit Stock Success ✅");
          navigate("/admin/products");
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.msg);
        });
    }
  };

  const onStockRequest = () => {
    let input = parseInt(inputChange);
    if (input > stockWarehouseFrom) {
      alert("jumlah barang melebihi stok");
    } else {
      let tanggal = format(new Date(), "yyyy-MM-dd H:m:s");
      Axios.post(
        API_URL + `/apis/product/stockmoverequest`,
        {
          id_product: idEdit,
          input: parseInt(inputChange),
          from_id_warehouse: idWarehouseFrom,
          to_id_warehouse: selectedWarehouse,
          date: tanggal,
          note: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      )
        .then((response) => {
          alert("Stock move Requested ✅");
          navigate("/admin/products");
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.msg);
        });
    }
  };

  //USE EFFECT
  useEffect(() => {
    getProduct();
  }, [selectedWarehouse]);
  useEffect(() => {
    getWarehouse();
  }, []);
  useEffect(() => {
    getCategory();
  }, []);
  useEffect(() => {
    getWarehouseFrom();
  }, [selectedWarehouse]);
  useEffect(() => {
    getStockFrom();
  }, [idWarehouseFrom]);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      errors.productName ||
      errors.productDescription ||
      errors.price ||
      errors.weight
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors]);

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

  const printDataWarehouseFrom = () => {
    let data = dataWarehouseFrom;
    if (dataWarehouseFrom) {
      return data.map((val, idx) => {
        if (val.status == 2 || val.status == 1) {
          return (
            <option value={val?.id_warehouse}>
              {val?.warehouse_branch_name}
            </option>
          );
        }
      });
    }
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Detail Produk";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  useEffect(() => {
    let admin = [2, 3];
    if (!productChecker) {
      navigate("/admin/products");
    }
    if (role && !admin.includes(role)) {
      navigate("/");
    }
    if (!userToken) {
      navigate("/login");
    }
  }, [productChecker, role, userToken]);

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
        <Text fontSize="2xl">Detail Product</Text>
      </div>
      <div className="d-flex">
        <div className="col-6 p-3">
          <div className="my-3 d-flex">
            <div className="col-7 px-3">
              <div
                className="d-flex"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
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
            <div className="col-5">
              <div className="my-3">
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
              <div className="my-3">
                <label className="form-label fw-bold text-muted">Berat</label>
                <Input
                  id="weight"
                  type="number"
                  className={
                    errors.weight && touched.weight ? "input-error" : ""
                  }
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
              <div className="my-3">
                <label className="form-label fw-bold text-muted">
                  Kategori
                </label>
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
          </div>
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
          <ButtonGroup>
            {isEdit && (
              <Button
                type="button"
                width="full"
                colorScheme="orange"
                variant={buttonDisabled ? "outline" : "solid"}
                onClick={() => onEdit()}
                isDisabled={buttonDisabled}
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
                onClick={() => onDelete()}
              >
                Hapus Produk
              </Button>
            )}
            <Link to="/admin/products">
              <Button>Kembali</Button>
            </Link>
          </ButtonGroup>
          {buttonDisabled && (
            <Text fontSize="small" className="error">
              Please complete the form
            </Text>
          )}
        </div>
        <div className="col-6 p-3">
          <Text fontSize="2xl">Mutasi Stock</Text>
          <div>
            <div
              className="d-flex"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <label className="form-label fw-bold text-muted">Warehouse</label>
              <select
                className="form-control form-control-lg p-3 mx-3 my-2"
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                {isEdit && <option value="">all warehouse</option>}
                {printSelectWarehouse()}
              </select>
            </div>
            <div
              className="d-flex"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <label className="form-label fw-bold text-muted">Stock</label>
              <input
                type="text"
                className="form-control p-3 mx-3 my-2"
                placeholder="jmlh stok"
                value={dataStock}
                disabled
              />
            </div>
          </div>
          {!isEdit && (
            <div className="my-3">
              <div className="d-flex">
                <div
                  className={showChange ? "buttonstockselected" : "buttonstock"}
                  type="button"
                  colorScheme="orange"
                  variant={showChange ? "solid" : "outline"}
                  onClick={() => showChangeButton()}
                >
                  Stock Change
                </div>
                <div className="filler">_</div>
                <div
                  className={
                    showRequest ? "buttonstockselected" : "buttonstock"
                  }
                  type="button"
                  colorScheme="orange"
                  variant={showRequest ? "solid" : "outline"}
                  onClick={() => showRequestButton()}
                >
                  Request Stock
                </div>
              </div>
              {showChange && (
                <div className="stockbox">
                  <div>
                    <label className="form-label fw-bold text-muted">
                      INPUT CHANGE JUMLAH STOK
                    </label>
                    <input
                      type="number"
                      className="form-control inputstock"
                      placeholder="Jumlah barang"
                      value={inputChange}
                      onChange={(e) => setInputChange(e.target.value)}
                    />
                    <br />
                    <label className="form-label fw-bold text-muted">
                      TIPE PERUBAHAN
                    </label>
                    <select
                      className="form-control form-control-lg"
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
                      Catatan
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="catatan"
                      style={{
                        resize: "none",
                        height: "100px",
                      }}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    colorScheme="orange"
                    variant="solid"
                    onClick={() => onExecuteChange()}
                    className="my-2"
                  >
                    EXECUTE INPUT
                  </Button>
                </div>
              )}
              {showRequest && (
                <div className="stockbox">
                  <div className="flex d-flex ">
                    <div className="w-50 mx-2">
                      <label className="form-label fw-bold text-muted">
                        Minta Stok Warehouse
                      </label>
                      <select
                        className="form-control form-control-lg "
                        onChange={(e) => setIdWarehouseFrom(e.target.value)}
                      >
                        <option>Pilih Gudang</option>
                        {printDataWarehouseFrom()}
                      </select>
                    </div>
                    <div className="w-50 mx-2">
                      <label className="form-label fw-bold text-muted">
                        Jumlah stok di Gudang
                      </label>
                      <input
                        type="text"
                        className="form-control inputstock"
                        placeholder="jmlh stok"
                        value={stockWarehouseFrom}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="my-3">
                    <label className="form-label fw-bold text-muted">
                      Jumlah produk yg ingin diminta
                    </label>
                    <input
                      placeholder="jumlah produk "
                      type="number"
                      className="form-control p-3"
                      value={inputChange}
                      onChange={(e) => setInputChange(e.target.value)}
                    />
                    <label className="form-label fw-bold text-muted my-2">
                      Catatan
                    </label>
                    <textarea
                      type="text"
                      className="form-control p-3"
                      placeholder="catatan"
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
                      onClick={() => onStockRequest()}
                    >
                      Request Stock
                    </Button>
                    <Link to="/admin/products">
                      <Button>Kembali</Button>
                    </Link>
                  </ButtonGroup>
                </div>
              )}
              {!showChange && !showRequest && (
                <div
                  className="stockbox"
                  style={{ height: "400px", width: "100%" }}
                >
                  Form Perubahan Stok
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
