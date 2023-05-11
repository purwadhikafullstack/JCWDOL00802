import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  ButtonGroup,
  Input,
  Select,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function AdminCategoryProduct() {
  // AMBIL DATA ROLE UTK DISABLE BUTTON EDIT KALO BUKAN SUPERADMIN
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  let userToken = localStorage.getItem("cnc_login");
  let navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (role === 3) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [role]);

  // STATE

  const [dataCategory, setDataCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(5);

  //STATE BUAT KATEGORI BARU
  const [showNew, setShowNew] = useState(false);
  const [preview, setPreview] = useState(`${API_URL}/img/category/default.png`);
  const [categoryPicture, setCategoryPicture] = useState("");

  //STATE BUAT EDIT KATEGORI
  const [idEdit, setIdEdit] = useState(0);
  const [categoryEdit, setCategoryEdit] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [previewEdit, setPreviewEdit] = useState(
    `${API_URL}/img/category/default.png`
  );
  const [categoryPictureEdit, setCategoryPictureEdit] = useState("");

  //button
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonDisabledEdit, setButtonDisabledEdit] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(true);

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      categoryName: categoryEdit,
    },
    enableReinitialize: true,
    validationSchema: basicSchema,
  });

  // GET DATA
  const getCategory = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let category = await Axios.post(
        API_URL + `/apis/product/categorylist`,
        { search, page: parseInt(page) - 1, limit, order },
        {
          headers: { Authorization: `Bearer ${getLocalStorage}` },
        }
      );
      setPage(category.data.page + 1);
      setDataCategory(category.data.data);
      setLastPage(category.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  //SHOWTAB

  const resetEdit = () => {
    if (showEdit == false) {
      setPreviewEdit(`${API_URL}/img/category/default.png`);
      setCategoryPictureEdit("");
      setIdEdit(0);
      setCategoryEdit("");
    }
  };
  const resetNew = () => {
    if (showNew == false && idEdit == 0) {
      setPreview(`${API_URL}/img/category/default.png`);
      setCategoryPicture("");
      setCategoryEdit("");
      setFirstLaunch(true);
    }
  };

  const showTabNew = () => {
    if (showNew == true) {
      setShowNew(false);
    } else if (showNew == false) {
      setShowNew(true);
      setShowEdit(false);
      // setFirstLaunch(true);
    }
  };

  const showTabEdit = (val) => {
    setShowNew(false);
    setShowEdit(true);
    setIdEdit(val.id_category);
    setCategoryEdit(val.category);
    setCategoryPictureEdit(val.category_picture);
    setPreviewEdit(`${API_URL}/img/category/${val.category_picture}`);
  };

  //GAMBAR
  const loadCategoryPictureNew = (e) => {
    const image = e.target.files[0];
    setCategoryPicture(image);
    setPreview(URL.createObjectURL(image));
  };

  const loadCategoryPictureEdit = (e) => {
    const image = e.target.files[0];
    setCategoryPictureEdit(image);
    setPreviewEdit(URL.createObjectURL(image));
  };

  //FUNCTION AXIOS
  const onAdd = () => {
    Axios.post(
      API_URL + `/apis/product/categoryadd`,
      {
        category: values.categoryName,
        category_picture: categoryPicture,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => {
        alert("Add Category Success ✅");
        setCategoryEdit("");
        setPreview(`${API_URL}/img/category/default.png`);
        setCategoryPicture("default.png");
        getCategory();
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.msg);
      });
  };

  const onEdit = () => {
    Axios.post(
      API_URL + `/apis/product/categoryedit`,
      {
        id_category: idEdit,
        category: values.categoryName,
        category_picture: categoryPictureEdit,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => {
        alert("Edit Category Success ✅");
        setCategoryEdit("");
        setPreviewEdit(`${API_URL}/img/category/default.png`);
        setCategoryPictureEdit("");
        getCategory();
        setShowEdit(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.msg);
      });
  };

  const onDelete = () => {
    let text = `Apa anda mau hapus kategori ${categoryEdit}`;
    if (window.confirm(text) == true) {
      Axios.post(
        API_URL + `/apis/product/categorydelete`,
        {
          id_category: idEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      )
        .then((response) => {
          alert("Delete Category Success ✅");
          setCategoryEdit("");
          setPreviewEdit(`${API_URL}/img/category/default.png`);
          setCategoryPictureEdit("");
          getCategory();
          setShowEdit(false);
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.msg);
        });
    }
  };

  useEffect(() => {
    getCategory();
    setShowEdit(false);
    setShowNew(false);
  }, [search, page, order, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, order, limit]);

  useEffect(() => {
    resetEdit();
  }, [showEdit]);

  useEffect(() => {
    resetNew();
  }, [showNew]);

  useEffect(() => {
    if (errors.categoryName || categoryPicture == "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors, categoryPicture]);

  useEffect(() => {
    if (errors.categoryName || categoryPictureEdit == "") {
      setButtonDisabledEdit(true);
    } else {
      setButtonDisabledEdit(false);
    }
  }, [errors, categoryPicture]);

  useEffect(() => {
    if (touched.categoryName) {
      setFirstLaunch(false);
    }
  }, [touched]);

  //PRINT DATA

  const printData = () => {
    let data = dataCategory ? dataCategory : [];
    let num = 0;
    return data.map((val, idx) => {
      num++;
      return (
        <Tr>
          <Td>{num}</Td>
          <Td>{val.category}</Td>
          <Td>
            <img
              src={`${API_URL}/img/category/${val.category_picture}`}
              className="img-thumbnail"
              alt=""
              style={{ height: "100px", width: "100px", objectFit: "cover" }}
            />
          </Td>
          <Td>
            <Button
              type="button"
              colorScheme="orange"
              variant="solid"
              onClick={() => showTabEdit(val)}
            >
              Detail
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Daftar Kategori";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  useEffect(() => {
    let admin = [2, 3];
    if (!userToken) {
      navigate("/login");
    } else if (role && !admin.includes(role)) {
      navigate("/");
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
      <div className="col-4">
        <Text fontSize="2xl">Kategori Produk</Text>
      </div>
      <div
        className="d-flex my-2"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div className="col-3">
          <Input
            type="text"
            className="form-control mt-3"
            placeholder="search kategori"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-3">
          <Select
            onChange={(e) => setOrder(e.target.value)}
            className="form-control form-control-lg mt-3
          "
          >
            <option value={0}>Paling Sesuai </option>
            <option value={1}>Nama Ascending </option>
            <option value={2}>Nama Descending</option>
          </Select>
        </div>
        <div className="col-3"></div>
        <div className="col-3">
          <ButtonGroup>
            {isEdit && (
              <Button
                type="button"
                colorScheme="orange"
                variant="solid"
                onClick={() => showTabNew()}
              >
                Kategori Baru
              </Button>
            )}
          </ButtonGroup>
        </div>
      </div>
      <div className="my-5 row">
        <div className="col-6">
          <TableContainer className="rounded">
            <Table size="sm">
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">No.</Th>
                  <Th color="#ffffff">Kategori</Th>
                  <Th color="#ffffff"></Th>
                  <Th color="#ffffff"></Th>
                </Tr>
              </Thead>
              <Tbody className="tablebody">{printData()}</Tbody>
            </Table>
          </TableContainer>
          <div
            className="d-flex my-5"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <PaginationOrder
              currentPage={parseInt(page)}
              totalPages={parseInt(lastPage)}
              onPageChange={setPage}
              maxLimit={0}
            />
            <div
              className="d-flex mx-5"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              menampilkan
              <Input
                type="text"
                className="form-control"
                placeholder="limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                style={{ width: "60px" }}
              />
              Kategori
            </div>
          </div>
        </div>
        <div className="col-6 row">
          {showNew && (
            <div className="card p-3">
              <Text>Add Kategori</Text>
              <div className="row">
                <div className="col-6">
                  <Input
                    id="categoryName"
                    type="text"
                    className={
                      errors.categoryName && touched.categoryName
                        ? "input-error"
                        : ""
                    }
                    placeholder="Nama Kategori Baru"
                    value={values.categoryName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.categoryName && touched.categoryName && (
                    <Text fontSize="small" className="error">
                      {errors.categoryName}
                    </Text>
                  )}
                </div>
                <div className="col-6">
                  <ButtonGroup>
                    <Button
                      type="button"
                      colorScheme="orange"
                      variant={
                        firstLaunch || buttonDisabled ? "outline" : "solid"
                      }
                      onClick={() => onAdd()}
                      isDisabled={firstLaunch || buttonDisabled}
                    >
                      Tambah Kategori
                    </Button>
                  </ButtonGroup>
                  {buttonDisabled && (
                    <Text fontSize="small" className="error">
                      Please complete the form
                    </Text>
                  )}
                </div>

                <div>
                  <label className="form-label fw-bold text-muted">
                    Gambar Produk
                  </label>
                  <div>
                    {preview ? (
                      <img
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
                        src={categoryPicture}
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
                  <div className="col-6">
                    <label htmlFor="formFile" className="form-label">
                      Upload image here
                    </label>
                    <input
                      onChange={loadCategoryPictureNew}
                      className="form-control"
                      type="file"
                      id="formFile"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* EDIT */}
          {showEdit && (
            <div className="card p-3">
              <Text>Detail Kategori</Text>
              <div className="row">
                <div className="col-6">
                  <Input
                    id="categoryName"
                    type="text"
                    className={
                      errors.categoryName && touched.categoryName
                        ? "input-error"
                        : ""
                    }
                    placeholder="Nama Kategori Baru"
                    value={values.categoryName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.categoryName && touched.categoryName && (
                    <Text fontSize="small" className="error">
                      {errors.categoryName}
                    </Text>
                  )}
                </div>
                <div className="col-6">
                  {isEdit && (
                    <ButtonGroup>
                      <Button
                        type="button"
                        colorScheme="orange"
                        variant="solid"
                        onClick={() => onEdit()}
                        isDisabled={buttonDisabledEdit}
                      >
                        Edit Kategori
                      </Button>
                      <Button
                        type="button"
                        colorScheme="orange"
                        variant="solid"
                        onClick={() => onDelete()}
                      >
                        Hapus Kategori
                      </Button>
                    </ButtonGroup>
                  )}
                </div>
                <div>
                  <label className="form-label fw-bold text-muted">
                    Gambar Produk
                  </label>
                  <div>
                    {preview ? (
                      <img
                        className="img-thumbnail"
                        src={previewEdit}
                        alt=""
                        style={{
                          height: "300px",
                          width: "300px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src={categoryPictureEdit}
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
                    <div className="col-6">
                      <label htmlFor="formFile" className="form-label">
                        Upload image here
                      </label>
                      <input
                        onChange={loadCategoryPictureEdit}
                        className="form-control"
                        type="file"
                        id="formFile"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategoryProduct;
