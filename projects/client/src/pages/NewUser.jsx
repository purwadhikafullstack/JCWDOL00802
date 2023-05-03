import React, { useCallback, useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Axios from "axios";
import {
  Button,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../helper";
import { useFormik } from "formik";
import { basicSchema } from "../schemas";

const NewUser = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let token = location.search.split("=")[1];

  const [visible, setVisible] = useState("password");
  const [visible2, setVisible2] = useState("password");

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: basicSchema,
  });

  const onRegis = () => {
    let num = 0;
    if (subs) {
      num = 1;
    } else {
      num = 0;
    }
    Axios.post(
      API_URL + `/apis/user/verify`,
      {
        password: values.password,
        subs: num,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        alert("Input Password Success ✅");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onVisibility = useCallback(() => {
    if (visible == "password") {
      setVisible("text");
    } else if (visible == "text") {
      setVisible("password");
    }
  }, [visible]);

  const onVisibility2 = useCallback(() => {
    if (visible2 == "password") {
      setVisible2("text");
    } else if (visible2 == "text") {
      setVisible2("password");
    }
  }, [visible2]);

  const [agree, setAgree] = useState(false);
  const [subs, setSubs] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    if (errors.password || errors.confirmPassword || !agree) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [errors, agree]);

  useEffect(() => {
    if (touched.password || touched.confirmPassword) {
      setFirstLaunch(false);
    }
  }, [touched]);

  //use callback & use memorize

  return (
    <div id="regispage">
      <div className="container py-5">
        <div className="row bg-white my-5 shadow rounded">
          <div className="col-12 col-md-8 d-none d-md-block">
            <img
              src={require("../Assets/logo.png")}
              width="100%"
              alt="content"
            />
          </div>
          <div className="col-12 col-md-4 p-5 shadow">
            <h6 className="fw-bold muted-color">Click N Collect</h6>
            <Text className="fw-bold" fontSize="4xl">
              Daftar dengan Email
            </Text>
            <div id="form">
              <div className="my-3 ">
                <label className="form-label fw-bold text-muted">
                  Kata Sandi
                </label>
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
              <div className="my-3 ">
                <label className="form-label fw-bold text-muted">
                  Masukan ulang kata sandi
                </label>
                <InputGroup className="input-group border rounded">
                  <Input
                    id="confirmPassword"
                    type={visible2}
                    placeholder="8+ character"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.confirmPassword && touched.confirmPassword
                        ? "input-error"
                        : ""
                    }
                  />
                  <InputRightElement
                    onClick={() => onVisibility2()}
                    className="input-group-text bg-transparent border-0"
                    id="basic-addon2"
                  >
                    {visible2 == "password" ? (
                      <AiOutlineEye size={26} />
                    ) : (
                      <AiOutlineEyeInvisible size={26} />
                    )}
                  </InputRightElement>
                </InputGroup>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text fontSize="small" className="error">
                    {errors.confirmPassword}
                  </Text>
                )}
              </div>
            </div>
            <div>
              <CheckboxGroup colorScheme="orange" size="sm">
                <Checkbox
                  onChange={(e) => {
                    setAgree(e.target.checked);
                  }}
                >
                  I agree to the terms and condition
                </Checkbox>
                <Checkbox
                  onChange={(e) => {
                    setSubs(e.target.checked);
                  }}
                >
                  I want to subscibe to CNC newsletter
                </Checkbox>
              </CheckboxGroup>
            </div>
            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant={firstLaunch || buttonDisabled ? "outline" : "solid"}
              onClick={() => onRegis()}
              isDisabled={firstLaunch || buttonDisabled}
            >
              Selesai
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
