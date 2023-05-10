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

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        alert("Wrong Password");
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

  return (
    <div className="paddingmain">
      <div className="bg-white my-5 w-100 p-5 m-auto shadow">
        <Text fontSize="4xl" className="fw-bold">
          Login
        </Text>
        <div className="mt-5 mb-3">
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
