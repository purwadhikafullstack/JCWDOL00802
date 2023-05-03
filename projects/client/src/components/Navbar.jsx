import React, { useCallback } from "react";
import {
  Avatar,
  AvatarBadge,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
  Badge,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
} from "@chakra-ui/react";
import {
  AiOutlineMessage,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineUser,
  AiOutlineBell,
  AiOutlineClose,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { logoutAction } from "../actions/userAction";
import { useState, useEffect } from "react";
import { API_URL } from "../helper";
import Axios from "axios";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const [newPendingRequestsCount, setNewPendingRequestsCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [newPendingRequests, setNewPendingRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [dataCategory, setDataCategory] = useState(null);

  const { id_user, email, role, profile_picture } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      email: state.userReducer.email,
      role: state.userReducer.role,
      profile_picture: state.userReducer.profile_picture,
    };
  });

  useEffect(() => {
    if (id_user) {
      const getUserById = async (id_user) => {
        const response = await Axios.get(`${API_URL}/apis/user/profile/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setAvatarSrc(response.data.profile_picture);
      };
      getUserById(id_user);
    }
  }, [id_user]);

  useEffect(() => {
    if (role === 2) {
      fetchPendingRequests();
    }
  }, [role]);

  const fetchPendingRequests = async () => {
    try {
      const response = await Axios.get(
        API_URL + "/apis/dashboard/list-pending-request",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      );

      const removedNotifications =
        JSON.parse(localStorage.getItem("removedNotifications")) || [];

      const newPendingRequests = response.data.pendingRequests.filter(
        (request) =>
          request.is_new && !removedNotifications.includes(request.id_mutation)
      );

      setNewPendingRequestsCount(newPendingRequests.length);
      setNewPendingRequests(newPendingRequests);
      setPendingRequests(response.data.pendingRequests);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = useCallback(
    (id) => {
      const removedNotifications =
        JSON.parse(localStorage.getItem("removedNotifications")) || [];
      removedNotifications.push(id);
      localStorage.setItem(
        "removedNotifications",
        JSON.stringify(removedNotifications)
      );

      setNewPendingRequests(
        newPendingRequests.filter((request) => request.id_mutation !== id)
      );
      setNewPendingRequestsCount(newPendingRequestsCount - 1);
    },
    [newPendingRequests, newPendingRequestsCount]
  );

  const getCategory = async () => {
    try {
      let category = await Axios.get(API_URL + `/apis/product/category`);
      setDataCategory(category.data);
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

  useEffect(() => {
    getCategory();
  }, []);

  const printCategory = () => {
    let data = dataExist ? dataCategory : [];
    return (
      <MenuList>
        {data.map((val, idx) => {
          if (idx < 10) {
            return <MenuItem>{val.category}</MenuItem>;
          }
        })}
        {data.length >= 10 && (
          <>
            <hr />
            <MenuItem>Lihat Semua Kategori</MenuItem>
          </>
        )}
      </MenuList>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="Logo">
          <img
            src={require("../Assets/logotengah2.png")}
            alt="Click N Collect"
            style={{ height: 40, objectFit: "scale-down" }}
          />
        </Link>
        {/* Toggle kalo layarny mengecil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Kategori */}
          <Menu>
            <MenuButton
              className="nav-item main-content-color"
              style={{ cursor: "pointer" }}
            >
              Kategori
            </MenuButton>
            {/* Drop Down Kategori */}
            {printCategory()}
          </Menu>
          {/* Pencarian / Search Bar */}
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<AiOutlineSearch />}
            />
            <Input type="tel" placeholder="Ketik kata kunci" maxWidth={500} />
          </InputGroup>
          {/* Gambar profiling, cart, dan transaction */}
          <Popover
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          >
            <PopoverTrigger>
              <Button
                variant="unstyled"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Box position="relative">
                  <AiOutlineBell size={40} color={"#f96c08"} />
                  {newPendingRequestsCount > 0 && (
                    <Badge
                      position="absolute"
                      top={0}
                      right={0}
                      borderRadius="full"
                      bg="red.500"
                      color="white"
                    >
                      {newPendingRequestsCount}
                    </Badge>
                  )}
                </Box>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Box
                zIndex="1"
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="sm"
                minWidth="250px"
              >
                <Box fontWeight="bold" p={3}>
                  Notifications
                </Box>
                <Box height="1px" bg="gray.200" my={2} />
                {newPendingRequests.map((request) => {
                  const {
                    id_mutation,
                    id_product,
                    id_warehouse_sender,
                    id_warehouse_receiver,
                    date,
                  } = request.dataValues || request;
                  const formattedDate = new Date(date).toLocaleDateString(); // You can customize the date format here if needed
                  return (
                    <Box
                      key={id_mutation}
                      p={3}
                      display="flex"
                      justifyContent="space-between"
                    >
                      {`New Request ${request.product.name} from ${request.warehouseReceiver.warehouse_branch_name}, ${formattedDate}`}
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        icon={<AiOutlineClose />}
                        onClick={() => deleteNotification(id_mutation)}
                      />
                    </Box>
                  );
                })}
              </Box>
            </PopoverContent>
          </Popover>
          <Link to="/profile">
            <AiOutlineUser size={40} color={"#f96c08"} className="mx-1" />
          </Link>
          <Link to="/cart">
            <AiOutlineShopping size={40} color={"#f96c08"} className="mx-1" />
          </Link>
          <Link to="/transaction">
            <AiOutlineMessage size={40} color={"#f96c08"} className="mx-1" />
          </Link>
          {/* Avatar user (Kalau Login) / Masuk dan Registasi (Kalau belum Login) */}
          <form className="login" role="search" style={{ zIndex: 10 }}>
            {props.loading ? (
              <Spinner />
            ) : email && !props.loading ? (
              <Menu>
                <MenuButton type="button">
                  <Avatar
                    src={avatarSrc}
                    size="md"
                    className="avatar"
                    textColor={"black"}
                  >
                    <AvatarBadge boxSize="1em" bg="green.500" />
                  </Avatar>
                </MenuButton>
                {/* Drop Down */}
                <MenuList textColor="black">
                  <Link to="profile">
                    <MenuItem>{email}</MenuItem>
                  </Link>
                  <MenuDivider />
                  {/* Bila admin, tapi nanti di back end harus ganti super admin rolenya jadi 3 aja */}
                  {role == 2 || role == 3 ? (
                    <div>
                      <Link to="/admin/products">
                        <MenuItem>Pengelolaan Produk</MenuItem>
                      </Link>

                      <Link to="/admin/transaction">
                        <MenuItem>Pengelolaan Transaksi</MenuItem>
                      </Link>
                      <Link to="/admin/warehouse">
                        <MenuItem>Pengelolaan Gudang</MenuItem>
                      </Link>
                    </div>
                  ) : (
                    // Bila user, karena user kodenya 1, jadi semua yg lbh dr 1 itu admin atau super admin
                    <div>
                      <Link to="/cart">
                        <MenuItem>Keranjang</MenuItem>
                      </Link>
                      <Link to="/transaction">
                        <MenuItem>Transaksi Pembelian</MenuItem>
                      </Link>
                      <Link to="/address">
                        <MenuItem>Address</MenuItem>
                      </Link>
                    </div>
                  )}
                  <MenuDivider />
                  {/* Logout */}
                  <Link to="/">
                    <MenuItem onClick={() => dispatch(logoutAction())}>
                      Logout
                      <AiOutlineLogout className="ms-2" />
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            ) : (
              // Bila login bersifat false, keluar tombol utk login dan regis
              <ButtonGroup>
                <Link to="/login">
                  <Button type="button" colorScheme="orange" variant="solid">
                    Masuk
                  </Button>
                </Link>
                <Link to="/regis">
                  <Button type="button" colorScheme="orange" variant="outline">
                    Daftar
                  </Button>
                </Link>
              </ButtonGroup>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
