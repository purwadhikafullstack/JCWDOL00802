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
  FormErrorMessage,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { API_URL } from "../helper";
import { useSelector } from "react-redux";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters")
    .max(80, "Must be 80 characters or less")
    .required("Required"),
  fullName: Yup.string()
    .matches(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters")
    .max(80, "Must be 80 characters or less")
    .required("Required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .max(18, "Must be 18 characters or less")
    .required("Required"),
});

const Profile = (props) => {
  const { id, username, email, phone_number, profile_picture, full_name } =
    useSelector((state) => {
      return {
        id: state.userReducer.id_user,
        email: state.userReducer.email,
        username: state.userReducer.username,
        phone_number: state.userReducer.phone_number,
        profile_picture: state.userReducer.profile_picture,
        full_name: state.userReducer.full_name,
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
    setProfilePictureEdit(profile_picture);
    setPreview(profile_picture);
  }, [username, email, phone_number, full_name, profile_picture]);

  //load pitcure
  const loadProfilePictureEdit = (e) => {
    const image = e.target.files[0];
    setProfilePictureEdit(image);
    setPreview(URL.createObjectURL(image));
  };

  const onRegis = (username, fullName, phoneNumber) => {
    if (window.confirm("Are you sure you want to edit your profile?")) {
      const data = new FormData();
      data.append("username", username);
      data.append("email", emailEdit === "" ? email : emailEdit);
      data.append("phone_number", phoneNumber);
      data.append("full_name", fullName);
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

  const bg = useColorModeValue("gray.50", "gray.800");
  const formBg = useColorModeValue("white", "gray.700");
  const redButtonBg = useColorModeValue("red.400", "red.500");
  const blueButtonBg = useColorModeValue("blue.400", "blue.500");

  return (
    <Formik
      initialValues={{
        username: usernameEdit,
        fullName: full_nameEdit,
        phoneNumber: phone_numberEdit,
      }}
      validationSchema={ProfileSchema}
      onSubmit={(values) => {
        onRegis(values.username, values.fullName, values.phoneNumber);
      }}
    >
      {({ isSubmitting, isValid, dirty, touched, errors }) => (
        <Form>
          <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bg}>
            <Stack
              spacing={4}
              w={"full"}
              maxW={"md"}
              bg={"white"}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
              my={12}
            >
              <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                User Profile Edit
              </Heading>
              <FormControl id="userName">
                <FormLabel>User Icon</FormLabel>
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar size="xl" src={preview}>
                    {preview && (
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        icon={<SmallCloseIcon />}
                        onClick={() => { setPreview(''); setProfilePictureEdit(''); }}
                      />
                      )}
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
              <Field name="username">
                {({ field, form }) => (
                  <FormControl
                    id="username"
                    isInvalid={form.errors.username && form.touched.username}
                    isRequired
                  >
                    <FormLabel>User name</FormLabel>
                    <Input
                      {...field}
                      placeholder="UserName"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                    />
                    <FormErrorMessage>
                      <ErrorMessage name="username" />
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="fullName">
                {({ field, form }) => (
                  <FormControl
                    id="fullName"
                    isInvalid={form.errors.fullName && form.touched.fullName}
                    isRequired
                  >
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                    />
                    <FormErrorMessage>
                      <ErrorMessage name="fullName" />
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="phoneNumber">
                {({ field, form }) => (
                  <FormControl
                    id="phoneNumber"
                    isInvalid={
                      form.errors.phoneNumber && form.touched.phoneNumber
                    }
                    isRequired
                  >
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      {...field}
                      placeholder="Phone Number"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                    />
                    <FormErrorMessage>
                      <ErrorMessage name="phoneNumber" />
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
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
                    bg: redButtonBg,
                  }}
                  onClick={() => onReset()}
                >
                  Change Password
                </Button>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: blueButtonBg,
                  }}
                  isDisabled={!(dirty && isValid)}
                  _disabled={{
                    backgroundColor: "gray.200",
                    cursor: "not-allowed",
                  }}
                >
                  Approve Change
                </Button>
              </Stack>
            </Stack>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default Profile;

  
