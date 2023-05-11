import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { loginAction } from "../actions/userAction";
import { useDispatch } from "react-redux";
import { API_URL } from "../helper";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let userToken = localStorage.getItem("cnc_login");
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  let admin = [2, 3];

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: basicSchema,
  });

  const [visible, setVisible] = useState("password");

  const onBtnLogin = () => {
    // Melakukan request data ke server
    Axios.post(API_URL + `/apis/user/login`, {
      email: values.email,
      pass: values.password,
    })
      .then((response) => {
        dispatch(loginAction(response.data));
        localStorage.setItem("cnc_login", response.data.token);
        if (role == 1) {
          navigate("/", { replace: true });
        } else if (role == 2 || role == 3) {
          navigate("/admin", { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.msg);
      });
  };

  const onVisibility = useCallback(() => {
    if (visible == "password") {
      setVisible("text");
    } else if (visible == "text") {
      setVisible("password");
    }
  }, [visible]);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    if (errors.password || errors.email) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors]);

  useEffect(() => {
    if (touched.password || touched.email) {
      setFirstLaunch(false);
    }
  }, [touched]);

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Login";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);

  useEffect(() => {
    if (role && role == 1 && userToken) {
      navigate("/");
    } else if (role && admin.includes(role)) {
      navigate("/admin");
    }
  }, [role]);

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
      <div className="my-2 w-100 p-5 shadow">
        <Text fontSize="4xl" className="fw-bold">
          Login
        </Text>
        <div className="d-flex">
          <a className="muted-color">Belum daftar?</a>
          <a className="ms-2 main-color fw-bold" href="/regis">
            Daftar disini
          </a>
        </div>
        <div className="d-flex">
          <a className="muted-color">Lupa Password?</a>
          <a className="ms-2 main-color fw-bold" href="/requestreset">
            Reset Password disini
          </a>
        </div>
        <div className="mt-3 mb-3">
          <label className="form-label fw-bold text-muted">Email</label>
          <Input
            type="text"
            id="email"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? "input-error" : ""}
          />
          {errors.email && touched.email && (
            <Text fontSize="small" className="error">
              {errors.email}
            </Text>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold text-muted">Password</label>
          <InputGroup className="input-group border rounded">
            <Input
              id="password"
              type={visible}
              className={
                errors.password && touched.password ? "input-error" : ""
              }
              placeholder="8-16 character"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <InputRightElement
              onClick={() => onVisibility()}
              className="input-group-text bg-transparent border-0"
              id="basic-addon2"
            >
              {visible == "password" ? (
                <AiOutlineEye size={26} />
              ) : (
                <AiOutlineEyeInvisible size={26} />
              )}
            </InputRightElement>
          </InputGroup>
          {errors.password && touched.password && (
            <Text fontSize="small" className="error">
              {errors.password}
            </Text>
          )}
        </div>
        <Button
          type="button"
          colorScheme="orange"
          variant={firstLaunch || buttonDisabled ? "outline" : "solid"}
          onClick={() => onBtnLogin()}
          isDisabled={firstLaunch || buttonDisabled}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
