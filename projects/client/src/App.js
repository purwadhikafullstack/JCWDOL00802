import React from "react";
import Axios from "axios";
import "./App.css";
import { API_URL } from "./helper";
import { useEffect, useState } from "react";
import { loginAction } from "./actions/userAction";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import NewUser from "./pages/NewUser";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import ReportSales from "./pages/SalesReport";
import AdminWarehouse from "./pages/AdminWarehouse";
import NewWarehouse from "./pages/NewWarehouse";
import EditWarehouse from "./pages/EditWarehouse";
import OrderPage from "./pages/Orderlist";
import AdminProducts from "./pages/AdminProduct";
import EditProduct from "./pages/EditProduct";
import NewProduct from "./pages/NewProduct";
import AdminCategoryProduct from "./pages/CategoryProduct";
import StockHistory from "./pages/StockHistory";
import StockHistoryDetail from "./pages/StockHistoryDetail";

function App() {
  // KODE DARI PURWADHIKA
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/greetings`
  //     );
  //     setMessage(data?.message || "");
  //   })();
  // }, []);

  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();
  const { id_user, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };
  });
  const admin = [2, 3];

  //KEEP LOGIN
  const keepLogin = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      if (getLocalStorage) {
        let res = await Axios.get(API_URL + `/apis/user/keep`, {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        });
        delete res.data.password;
        dispatch(loginAction(res.data)); // menjalankan fungsi action
        setLoading(false); // loading dimatikan ketika berhasil mendapat response
        localStorage.setItem("cnc_login", res.data.token);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //USE EFFECT
  useEffect(() => {
    keepLogin();
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regis" element={<Register />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        {/* semua yang butuh login user taruh dalam <></> bawah ini */}
        {role == 1 && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/transaction" element={<OrderPage />} />
          </>
        )}
        {/* semua yang butuh minimal admin taruh didalam <> bawah ini */}
        {admin.includes(role) && (
          <>
            <Route path="/admin/salesreport" element={<ReportSales />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/category" element={<AdminCategoryProduct />} />

            <Route path="/admin/editproduct" element={<EditProduct />} />
            <Route path="/admin/stockhistory" element={<StockHistory />} />
            <Route
              path="/admin/stockhistory/:id"
              element={<StockHistoryDetail />}
            />
          </>
        )}

        {/* semua yang butuh superadmin taruh dalam <></> bawah ini */}
        {role == 3 && (
          <>
            <Route path="/admin/warehouse" element={<AdminWarehouse />} />
            <Route path="/admin/newwarehouse" element={<NewWarehouse />} />
            <Route path="/admin/newproduct" element={<NewProduct />} />
            <Route path="/admin/editwarehouse" element={<EditWarehouse />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
