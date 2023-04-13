import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  ButtonGroup,
  Input,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

function AdminCategoryProduct() {
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

  // STATE
  const [dataCategory, setDataCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  //STATE BUAT KATEGORI BARU
  const [newCategory, setNewCategory] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [preview, setPreview] = useState(`${API_URL}/img/category/default.png`);
  const [categoryPicture, setCategoryPicture] = useState("default.png");

  //STATE BUAT EDIT KATEGORI
  const [idEdit, setIdEdit] = useState(0);
  const [categoryEdit, setCategoryEdit] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [previewEdit, setPreviewEdit] = useState(
    `${API_URL}/img/category/default.png`
  );
  const [categoryPictureEdit, setCategoryPictureEdit] = useState("");

  // GET DATA
  const getCategory = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let category = await Axios.post(
        API_URL + `/apis/product/categorylist?page=${page}&limit=5`,
        { search },
        {
          headers: { Authorization: `Bearer ${getLocalStorage}` },
        }
      );
      setDataCategory(category.data.data);
      setTotalPage(category.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  let dataExist = false;
  if (dataCategory == null) {
    dataExist = false;
  } else {
    dataExist = true;
  }

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
    if (showNew == false) {
      setNewCategory("");
      setPreview(`${API_URL}/img/category/default.png`);
      setCategoryPicture("default.png");
    }
  };

  const showTabNew = () => {
    if (showNew == true) {
      setShowNew(false);
    } else if (showNew == false) {
      setShowNew(true);
      setShowEdit(false);
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
        category: newCategory,
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
        setNewCategory("");
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
        category: categoryEdit,
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
        });
    }
  };

  useEffect(() => {
    getCategory();
  }, [search, page]); //KALO SEARCH BERUBAH

  useEffect(() => {
    resetEdit();
  }, [showEdit]);

  useEffect(() => {
    resetNew();
  }, [showNew]);

  //PRINT DATA

  const printData = () => {
    let data = dataExist ? dataCategory : [];
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

  //page
  function pageButton() {
    return (
      <NumberInput
        size="xs"
        maxW={16}
        defaultValue={1}
        min={1}
        max={totalPage}
        onChange={(e) => setPage(parseInt(e) - 1)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
  }

  return (
    <div className="bg-white  w-100 p-5 m-auto ">
      <div className="d-flex my-2">
        <div className="col-4">
          <Text className="ps-4 " fontSize="4xl">
            Kategori Produk
          </Text>
        </div>
        <div className="col-4">
          <Input
            type="text"
            className="form-control p-3"
            placeholder="search kategori"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-4 mx-5">
          <ButtonGroup>
            {isEdit && (
              <Button
                type="button"
                colorScheme="orange"
                variant="solid"
                onClick={showTabNew}
              >
                Kategori Baru
              </Button>
            )}
          </ButtonGroup>
        </div>
      </div>
      <div className="my-5 row">
        <div className="col-6">
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>No.</Th>
                  <Th>Kategori</Th>
                  <Th></Th>
                  <Th>{pageButton()}</Th>
                </Tr>
              </Thead>
              <Tbody>{printData()}</Tbody>
              <Tfoot>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </div>
        <div className="col-6 row">
          {showNew && (
            <div>
              <Text>Add Kategori</Text>
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-6 "
                    placeholder="Nama Kategori Baru"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <ButtonGroup>
                    <Button
                      type="button"
                      colorScheme="orange"
                      variant="solid"
                      onClick={onAdd}
                    >
                      Tambah Kategori
                    </Button>
                  </ButtonGroup>
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
            <div>
              <Text>Detail Kategori</Text>
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-6 "
                    placeholder="Nama Kategori Baru"
                    value={categoryEdit}
                    onChange={(e) => setCategoryEdit(e.target.value)}
                    disabled={!isEdit}
                  />
                </div>
                <div className="col-6">
                  {isEdit && (
                    <ButtonGroup>
                      <Button
                        type="button"
                        colorScheme="orange"
                        variant="solid"
                        onClick={onEdit}
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
