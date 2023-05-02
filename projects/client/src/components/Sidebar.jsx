import React, { useEffect, useState } from "react";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import {
  FaBars,
  FaMoneyBill,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaTh,
  FaUserAlt,
  FaUserEdit,
  FaUsers,
  FaFileAlt,
  FaGripVertical,
  FaHome,
  FaIcons,
  FaServer,
  FaHandHolding,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../actions/userAction";

const Sidebar = (props) => {
  const dispatch = useDispatch();

  // let show = window.location.pathname.includes("/admin");

  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const loginStatus = localStorage.getItem("cnc_login");
  const roleAdmin = loginStatus && (role == 2 || role == 3);
  const roleSuperAdmin = loginStatus && role == 3;

  const [show, setShow] = useState(false);

  const checkLink = () => {
    if (window.location.pathname.includes("/admin")) {
      setShow(true);
    } else if (!window.location.pathname.includes("/admin")) {
      setShow(false);
    }
  };

  useEffect(() => {
    checkLink();
  }, [useLocation()]);

  const menuItem = [
    {
      path: "/admin",
      name: "Home",
      icon: <FaTh />,
      show: roleAdmin,
    },
    {
      path: "/admin/category",
      name: "Kategori",
      icon: <FaIcons />,
      show: roleAdmin,
    },
    {
      path: "/admin/products",
      name: "Produk",
      icon: <FaShoppingBag />,
      show: roleAdmin,
    },
    {
      path: "/admin/requeststock",
      name: "Request stock",
      icon: <FaHandHolding />,
      show: roleAdmin,
    },

    {
      path: "/admin/warehouse",
      name: "Gudang",
      icon: <FaHome />,
      show: roleSuperAdmin,
    },
    {
      path: "/admin/salesreport",
      name: "Sales Report",
      icon: <FaFileAlt />,
      show: roleAdmin,
    },
    {
      path: "/admin/stockhistory",
      name: "StockHistory",
      icon: <FaServer />,
      show: roleAdmin,
    },
  ];
  return (
    <div>
      <div
        className="d-flex flex-row"
        // style={{ position: "fixed" }}
      >
        {show && (
          <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar">
            <div className="top-section">
              <h1
                style={{ display: isOpen ? "block" : "none" }}
                className="logo"
              >
                CNC ADMIN
              </h1>
              <div
                style={{ marginLeft: isOpen ? "50px" : "0px" }}
                className="bars"
              >
                <FaBars onClick={toggle} />
              </div>
            </div>

            <div>
              <div
                className="user-section"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  display: loginStatus ? "flex" : "none",
                }}
              >
                <h6
                  style={{
                    display: isOpen ? "block" : "none",
                    marginLeft: "10px",
                  }}
                >
                  {role == 2 && <>Welcome, Admin</>}
                  {role == 3 && <>Welcome, Super Admin</>}
                </h6>
              </div>
            </div>
            {menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
                activeclassName="active"
                style={{ display: item.show ? "flex" : "none" }}
              >
                <div className="icon">{item.icon}</div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
        )}
        <main>{props.children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
