import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaShoppingBag,
  FaTh,
  FaUserAlt,
  FaFileAlt,
  FaHome,
  FaIcons,
  FaServer,
  FaHandHolding,
  FaMoneyBillWave,
  FaChevronRight,
  FaChevronDown,
  FaPlus,
  FaFolder,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = (props) => {
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    if (isOpen == true) {
      setIsOpen(!isOpen);
      setIsOpenProduct(false);
      setIsOpenWarehouse(false);
      setIsOpenReport(false);
      setIsOpenPromo(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const loginStatus = localStorage.getItem("cnc_login");
  const roleAdmin = loginStatus && (role == 2 || role == 3);
  const roleSuperAdmin = loginStatus && role == 3;

  // SHOW SIDEBAR IF ADMIN
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

  // DROPDOWN CONDITION
  const [isOpenPromo, setIsOpenPromo] = useState(false);
  const togglePromo = () => {
    if (isOpen) {
      setIsOpenPromo(!isOpenPromo);
    }
  };
  const [isOpenProduct, setIsOpenProduct] = useState(false);
  const toggleProduct = () => {
    if (isOpen) {
      setIsOpenProduct(!isOpenProduct);
    }
  };
  const [isOpenWarehouse, setIsOpenWarehouse] = useState(false);
  const toggleWarehouse = () => {
    if (isOpen) {
      setIsOpenWarehouse(!isOpenWarehouse);
    }
  };
  const [isOpenReport, setIsOpenReport] = useState(false);
  const toggleReport = () => {
    if (isOpen) {
      setIsOpenReport(!isOpenReport);
    }
  };

  return (
    <div>
      <div className="d-flex flex-row">
        {show && (
          <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
            <div className="top-section" onClick={() => toggle()}>
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
                <FaBars />
              </div>
            </div>
            <hr />
            <div>
              <h6
                style={{
                  display: isOpen ? "block" : "none",
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {role == 2 && <>Welcome, Admin</>}
                {role == 3 && <>Welcome, Super Admin</>}
              </h6>
            </div>
            <hr />
            <div className="menu-content">
              <div>
                <NavLink
                  to="/admin"
                  className="link"
                  style={{ display: roleAdmin ? "flex" : "none" }}
                >
                  <FaTh />
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Dashboard
                  </div>
                </NavLink>
                <NavLink
                  to="/adminuserlist"
                  className="link"
                  style={{ display: roleSuperAdmin ? "flex" : "none" }}
                >
                  <FaUserAlt />
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Manage User
                  </div>
                </NavLink>
                <div style={{ display: roleSuperAdmin ? "block" : "none" }}>
                  <div
                    className={isOpenPromo ? "linkselected" : "link"}
                    onClick={() => togglePromo()}
                  >
                    <FaMoneyBillWave />
                    <div style={{ display: isOpen ? "block" : "none" }}>
                      Promo
                    </div>
                    {!isOpenPromo && (
                      <FaChevronRight
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                    {isOpenPromo && (
                      <FaChevronDown
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                  </div>
                  <div
                    className="dropdown"
                    style={{ display: isOpenPromo ? "block" : "none" }}
                  >
                    <NavLink
                      to="/admin/newpromo"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleSuperAdmin ? "flex" : "none" }}
                    >
                      <FaPlus />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Add Promo
                      </div>
                    </NavLink>
                    <NavLink
                      to="/admin/promo"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleSuperAdmin ? "flex" : "none" }}
                    >
                      <FaMoneyBillWave />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Promo List
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div>
                  <div
                    className={isOpenProduct ? "linkselected" : "link"}
                    onClick={() => toggleProduct()}
                  >
                    <FaShoppingBag />
                    <div style={{ display: isOpen ? "block" : "none" }}>
                      Product Management
                    </div>
                    {!isOpenProduct && (
                      <FaChevronRight
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                    {isOpenProduct && (
                      <FaChevronDown
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                  </div>
                  <div
                    className="dropdown"
                    style={{ display: isOpenProduct ? "block" : "none" }}
                  >
                    <NavLink
                      to="/admin/newproduct"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleSuperAdmin ? "flex" : "none" }}
                    >
                      <FaPlus />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Add Product
                      </div>
                    </NavLink>
                    <NavLink
                      to="/admin/products"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleAdmin ? "flex" : "none" }}
                    >
                      <FaShoppingBag />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Product List
                      </div>
                    </NavLink>
                    <NavLink
                      to="/admin/category"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleAdmin ? "flex" : "none" }}
                    >
                      <FaIcons />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Categories
                      </div>
                    </NavLink>
                    <NavLink
                      to="/admin/requeststock"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleAdmin ? "flex" : "none" }}
                    >
                      <FaHandHolding />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Stock Request
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div style={{ display: roleSuperAdmin ? "block" : "none" }}>
                  <div
                    className={isOpenWarehouse ? "linkselected" : "link"}
                    onClick={() => toggleWarehouse()}
                  >
                    <FaHome />
                    <div style={{ display: isOpen ? "block" : "none" }}>
                      Warehouse
                    </div>
                    {!isOpenWarehouse && (
                      <FaChevronRight
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                    {isOpenWarehouse && (
                      <FaChevronDown
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                  </div>
                  <div
                    className="dropdown"
                    style={{ display: isOpenWarehouse ? "block" : "none" }}
                  >
                    <NavLink
                      to="/admin/newwarehouse"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleSuperAdmin ? "flex" : "none" }}
                    >
                      <FaPlus />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Add Warehouse
                      </div>
                    </NavLink>
                    <NavLink
                      to="/admin/warehouse"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleSuperAdmin ? "flex" : "none" }}
                    >
                      <FaHome />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Warehouse List
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div>
                  <div
                    className={isOpenReport ? "linkselected" : "link"}
                    onClick={() => toggleReport()}
                  >
                    <FaFolder />
                    <div style={{ display: isOpen ? "block" : "none" }}>
                      Report
                    </div>
                    {!isOpenReport && (
                      <FaChevronRight
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                    {isOpenReport && (
                      <FaChevronDown
                        style={{ display: isOpen ? "block" : "none" }}
                      />
                    )}
                  </div>
                  <div
                    className="dropdown"
                    style={{ display: isOpenReport ? "block" : "none" }}
                  >
                    <NavLink
                      to="/admin/salesreport"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleAdmin ? "flex" : "none" }}
                    >
                      <FaFileAlt />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Sales Report
                      </div>
                    </NavLink>
                    <NavLink
                      to="/admin/stockhistory"
                      className={isOpen ? "link dropdowncontent" : "link"}
                      style={{ display: roleAdmin ? "flex" : "none" }}
                    >
                      <FaServer />
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        Stock History
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <main>{props.children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
