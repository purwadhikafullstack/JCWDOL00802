import React from "react";
import {
  Text,
  Avatar,
  AvatarBadge,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import {
  AiOutlineBell,
  AiOutlineMessage,
  AiOutlineSearch,
  AiOutlineShopping,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        <Link to="/">
          <img
            src={require("../Assets/logotengah2.png")}
            alt="Click N Collect"
            style={{ height: 40, objectFit: "scale-down" }}
          />
        </Link>
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <span
                className="nav-link main-content-color"
                style={{ cursor: "pointer" }}
              >
                Kategori
              </span>
            </li>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<AiOutlineSearch />}
              />
              <Input type="tel" placeholder="Search" width={500} />
            </InputGroup>
            <AiOutlineShopping size={40} color={"#f96c08"} className="mx-1" />
            <AiOutlineBell size={40} color={"#f96c08"} className="mx-1" />
            <AiOutlineMessage size={40} color={"#f96c08"} className="mx-1" />
          </ul>

          <form className="d-flex" role="search">
            {/* {props.loading ? (
              <Spinner />
            ) : username && !props.loading ? (
              <Menu>
                <MenuButton type="button">
                  <Avatar name={username} size="md">
                    <AvatarBadge boxSize="1em" bg="green.500" />
                  </Avatar>
                </MenuButton>
                <MenuList textColor="black">
                  {role == "Admin" ? (
                    <div>
                      <MenuItem>Products Management</MenuItem>
                      <MenuItem>Transactions Management</MenuItem>
                    </div>
                  ) : (
                    <div>
                      <MenuItem>Cart </MenuItem>
                      <MenuItem>Transactions</MenuItem>
                      <MenuItem>Profile</MenuItem>
                    </div>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={() => dispatch(logoutAction())}>
                    Logout
                    <AiOutlineLogout className="ms-2" />
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : ( */}
            <ButtonGroup>
              <Link to="/login">
                <Button type="button" colorScheme="orange" variant="solid">
                  Login
                </Button>
              </Link>
              <Link to="/regis">
                <Button type="button" colorScheme="orange" variant="outline">
                  Register
                </Button>
              </Link>
            </ButtonGroup>
            {/* )} */}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
