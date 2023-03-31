import React, { useCallback, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Axios from "axios";
import { Button, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../helper";

const ResetPassword = (props) => {
  const location = useLocation();
  let token = location.search.split("=")[1];

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [check, setCheck] = React.useState("");
  const [visible, setVisible] = React.useState("password");
  const [visible2, setVisible2] = React.useState("password");

  const onRegis = () => {
    Axios.patch(
      API_URL + `/user/resetpassword`,
      {
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        alert("Verify Success ✅");
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
              {" "}
              Reset Password
            </Text>

            <div id="form">
              <div className="my-3 ">
                <label className="form-label fw-bold text-muted">
                  Kata Sandi Baru
                </label>
                <div className="input-group border rounded">
                  <input
                    type={visible}
                    className="form-control p-3 border-0"
                    placeholder="8+ character"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={onVisibility}
                    className="input-group-text bg-transparent border-0"
                    id="basic-addon2"
                  >
                    {visible == "password" ? (
                      <AiOutlineEye size={26} />
                    ) : (
                      <AiOutlineEyeInvisible size={26} />
                    )}
                  </span>
                </div>
              </div>
              <div className="my-3 ">
                <label className="form-label fw-bold text-muted">
                  Masukan ulang kata sandi
                </label>
                <div className="input-group border rounded">
                  <input
                    type={visible}
                    className="form-control p-3 border-0"
                    placeholder="8+ character"
                    onChange={(e) => setCheck(e.target.value)}
                  />
                  <span
                    onClick={onVisibility2}
                    className="input-group-text bg-transparent border-0"
                    id="basic-addon2"
                  >
                    {visible2 == "password" ? (
                      <AiOutlineEye size={26} />
                    ) : (
                      <AiOutlineEyeInvisible size={26} />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant="solid"
              onClick={onRegis}
            >
              Reset Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
