import React from "react";
import { Text, Button } from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { loginAction } from "../actions/userAction";
import { useDispatch } from "react-redux";
import { API_URL } from "../helper";

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputEmail, setInputEmail] = React.useState(
    "adminclickncollectTangerang@gmail.com"
  );
  const [inputPass, setInputPass] = React.useState("Shinysmile123!");
  const [inputType, setInputType] = React.useState("password");

  const onBtnLogin = () => {
    // Melakukan request data ke server
    Axios.post(API_URL + `/apis/user/login`, {
      email: inputEmail,
      pass: inputPass,
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

  const onBtnVisible = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  return (
    <div>
      <div className="bg-white my-5 w-100 p-5 m-auto shadow">
        <Text fontSize="4xl" className="fw-bold">
          Login
        </Text>
        <div className="mt-5 mb-3">
          <label className="form-label fw-bold text-muted">Email</label>
          <input
            type="email"
            value={inputEmail}
            className="form-control p-3"
            placeholder="Email"
            onChange={(element) => setInputEmail(element.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold text-muted">Password</label>
          <div className="input-group border rounded">
            <input
              type={inputType}
              value={inputPass}
              className="form-control p-3 border-0"
              onChange={(element) => setInputPass(element.target.value)}
            />
            <span
              className="input-group-text bg-transparent border-0"
              onClick={onBtnVisible}
            >
              <AiOutlineEye />
            </span>
          </div>
        </div>
        <Button
          type="button"
          colorScheme="blue"
          variant="solid"
          onClick={onBtnLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
