import React from "react";
import Axios from "axios";
import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

import { API_URL } from "../helper";
const Profile = (props) => {
  const { email, id } = useSelector((state) => {
    return {
      id: state.userReducer.id_user,
      email: state.userReducer.email,
    };
  });

  const [phoneEdit, setPhoneEdit] = React.useState("");
  const [emailEdit, setEmailEdit] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const onRegis = () => {
    Axios.patch(
      API_URL + `/apis/user/edit`,
      {
        //data ygdiedit disini
      },
      {
        where: { email },
      }
    )
      .then((response) => {
        alert("Edit Profile Success ✅");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onReset = () => {
    Axios.post(API_URL + `/apis/user/resetRequest`, {
      email,
    })
      .then((response) => {
        alert("Request Reset Password Success ✅, Check your email");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-white my-5 w-100 p-5 m-auto shadow">
      <Text className="ps-4 pt-3" fontSize="4xl">
        {" "}
        My Profile
      </Text>
      <div id="regispage" className="row">
        <div className="col-6 px-5">
          <div className="my-3">
            <label className="form-label fw-bold text-muted">NIP</label>
            <input
              placeholder="input NIP "
              type="text"
              className="form-control p-3"
              value={id}
              disabled
            />
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Email</label>
            <input
              type="email"
              className="form-control p-3"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmailEdit(e.target.value)}
              disabled
            />
          </div>
          <div className="my-3">
            <label className="form-label fw-bold text-muted">Phone</label>
            <input
              type="text"
              className="form-control p-3"
              placeholder="Phone Number"
              value={id}
              onChange={(e) => setPhoneEdit(e.target.value)}
            />
          </div>
        </div>
        <div className="col-6 px-5">
          <div className="row bg-white">
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">
                Current Password
              </label>
              <input
                type="text"
                className="form-control p-3"
                placeholder=""
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
              />
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">
                New Password
              </label>
              <input
                type="text"
                className="form-control p-3"
                placeholder=""
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>
            <div className="my-3">
              <label className="form-label fw-bold text-muted">
                Confirm Password
              </label>
              <input
                type="text"
                className="form-control p-3"
                placeholder=""
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
          </div>
          <ButtonGroup>
            <Button
              type="button"
              width="full"
              colorScheme="blue"
              variant="solid"
              onClick={onRegis}
            >
              Approve Change
            </Button>

            <Button
              type="button"
              width="full"
              colorScheme="blue"
              variant="solid"
              onClick={onReset}
            >
              Reset Password
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default Profile;
