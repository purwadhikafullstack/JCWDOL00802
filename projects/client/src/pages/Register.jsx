import React, { useCallback, useState } from "react";
// import { FcGoogle } from "react-icons/fc";
import Axios from "axios";
import { Button, Text } from "@chakra-ui/react";
import { API_URL } from "../helper";
import { useNavigate } from "react-router-dom";

const Register = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const onRegis = () => {
    Axios.post(API_URL + `/user/regis`, {
      email,
    });
    navigate("/")
      .then((response) => {
        alert("Register Success ✅");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row bg-white my-5 shadow rounded">
          {/* Gambar sebelah kiri, kalao layar kecil hilang */}
          <div className="col-12 col-md-8 d-none d-md-block">
            <img
              src={require("../Assets/logo.png")}
              width="100%"
              alt="content"
            />
          </div>
          {/* Input Data User sebelah Kanan */}
          <div className="col-12 col-md-4 p-5 shadow">
            <h6 className="fw-bold muted-color">Click N Collect</h6>
            <Text className="fw-bold" fontSize="4xl">
              {" "}
              Daftar disini
            </Text>
            <div className="d-flex">
              <h6 className="muted-color">Sudah daftar ?</h6>
              <h6 className="ms-2 main-color fw-bold">Masuk disini</h6>
            </div>
            <div id="form">
              <div className="my-3">
                <label className="form-label fw-bold text-muted">Email</label>
                <input
                  type="email"
                  className="form-control p-3"
                  placeholder=""
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              width="full"
              colorScheme="orange"
              variant="solid"
              onClick={onRegis}
            >
              Daftar
            </Button>
            {/* Social Media Login */}
            {/* <div className="text-center text-muted">
              <span>atau</span>
            </div>
            <button
              //   onClick={() =>
              //     window.open(`https://google.com`, "_blank").focus()
              //   }
              className="btn btn-light py-2 text-muted mt-2 w-100 shadow"
            >
              <div className="d-flex justify-content-center align-items-center">
                <FcGoogle size={36} className="me-2" />{" "}
                <span> Daftar dengan Google</span>
              </div>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
