import React from "react";
import Axios from "axios";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Icon,
  Text
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { API_URL } from "../helper";
import { useSelector } from "react-redux";
import { FaStar } from 'react-icons/fa';

const Profile = (props) => {
  const { id, username, email, phone_number, profile_picture, full_name, subscription  } =
    useSelector((state) => {
      return {
        id: state.userReducer.id_user,
        email: state.userReducer.email,
        username: state.userReducer.username,
        phone_number: state.userReducer.phone_number,
        profile_picture: state.userReducer.profile_picture,
        full_name: state.userReducer.full_name,
        subscription: state.userReducer.subs.data[0]
      };
    });

  const [usernameEdit, setUsernameEdit] = React.useState(username);
  const [emailEdit, setEmailEdit] = React.useState(email);
  const [phone_numberEdit, setPhoneEdit] = React.useState(phone_number);
  const [profile_pictureEdit, setProfilePictureEdit] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const [full_nameEdit, setFullNameEdit] = React.useState(full_name);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    setUsernameEdit(username);
    setEmailEdit(email);
    setPhoneEdit(phone_number);
    setFullNameEdit(full_name);
  }, [username, email, phone_number, full_name]);

  //load pitcure
  const loadProfilePictureEdit = (e) => {
    const image = e.target.files[0];
    setProfilePictureEdit(image);
    setPreview(URL.createObjectURL(image));
  };

  const onRegis = () => {
    if (window.confirm("Are you sure you want to edit your profile?")) {
      const data = new FormData();
      data.append("username", usernameEdit === "" ? username : usernameEdit);
      data.append("email", emailEdit === "" ? email : emailEdit);
      data.append(
        "phone_number",
        phone_numberEdit === "" ? phone_number : phone_numberEdit
      );
      data.append(
        "full_name",
        full_nameEdit === "" ? full_name : full_nameEdit
      );
      if (profile_pictureEdit) {
        data.append("profile_picture", profile_pictureEdit);
      }
      Axios.post(API_URL + `/apis/user/edit/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          alert("Edit Profile Success ✅");
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Profile 
          <Icon
            as={FaStar}
            w={5}
            h={5}
            color={subscription ? "orange" : "gray.500"}
            ml={2}
          />
          <Text fontSize="sm" color={subscription ? "orange" : "gray.500"}>
          {subscription ? "Subscription Member" : "Not Subscription Member"}
        </Text>
        </Heading>
        <FormControl id="userName">
          <FormLabel>Profile Pitcure</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={profile_picture}>
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Input
                type="file"
                id="uploadImg"
                onChange={loadProfilePictureEdit}
              />
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName">
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={usernameEdit}
            onChange={(e) => setUsernameEdit(e.target.value)}
          />
        </FormControl>
        <FormControl id="FullName">
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="FullName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={full_nameEdit}
            onChange={(e) => setFullNameEdit(e.target.value)}
          />
        </FormControl>
        <FormControl id="PhoneNumber">
          <FormLabel>Phone Number</FormLabel>
          <Input
            placeholder="Phone Number"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={phone_numberEdit}
            onChange={(e) => setPhoneEdit(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <FormControl id="newPassword">
          <FormLabel>New Password</FormLabel>
          <Input
            placeholder="New Password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <Input
            placeholder="Confirm Password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => onReset()}
          >
            Change Password
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={() => onRegis()}
          >
            Approve Change
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Profile;
