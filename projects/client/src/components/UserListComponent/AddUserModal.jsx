import React, { useState, useRef } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Avatar,
  AvatarBadge,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { API_URL } from "../../helper";

export default function AddUserModal({
  isOpen,
  onClose,
  setUpdateTrigger,
  updateTrigger,
}) {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const cancelRef = useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleAddUser = async (
    username,
    phoneNumber,
    fullName,
    role,
    password,
    email,
    profile_picture
  ) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("phone_number", phoneNumber);
    formData.append("full_name", fullName);
    formData.append("role", role);
    formData.append("password", password);
    formData.append("email", email);
    if (profilePicture !== null) {
      formData.append("profile_picture", profilePicture);
    }
    try {
      const response = await axios.post(
        API_URL + `/apis/user/adduser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("User created successfully");
        toast({
          title: "User Created",
          description: "User has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setUpdateTrigger(!updateTrigger);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const fileInputRef = useRef();

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setProfilePictureURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toast = useToast();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack as="form" onSubmit={handleAddUser} spacing={4}>
              {/* The profile picture form control */}
              <FormControl id="profilePicture">
                <FormLabel>Profile Picture</FormLabel>
                <Stack spacing={3}>
                  <Center>
                    <Avatar size="xl" src={profilePictureURL}>
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        icon={<SmallCloseIcon />}
                        onClick={() => setProfilePicture(null)}
                      />
                    </Avatar>
                  </Center>
                  <Center w="full">
                    <Button
                      w="full"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Change Icon
                    </Button>
                  </Center>
                </Stack>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  display="none"
                />
              </FormControl>

              {/* The username form control */}
              <FormControl id="userName" isRequired>
                <FormLabel>User name</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="UserName"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </FormControl>

              {/* The phone number form control */}
              <FormControl id="phoneNumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </FormControl>

              {/* The full name form control */}
              <FormControl id="fullName" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </FormControl>

              {/* The role form control */}
              <FormControl id="role" isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value))}
                  placeholder="Select Role"
                >
                  <option value="1">User</option>
                  <option value="2">Warehouse Admin</option>
                </Select>
              </FormControl>

              {/* The password form control */}
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  _placeholder={{ color: "gray.500" }}
                  type="password"
                />
              </FormControl>

              {/* The email form control */}
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  _placeholder={{ color: "gray.500" }}
                  type="email"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              colorScheme="green"
              onClick={() => {
                setIsAlertOpen(true);
              }}
            >
              Submit
            </Button>

            <AlertDialog
              isOpen={isAlertOpen}
              leastDestructiveRef={cancelRef}
              onClose={() => setIsAlertOpen(false)}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Add New User
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to add this new user?
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={() => setIsAlertOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        handleAddUser(
                          username,
                          phoneNumber,
                          fullName,
                          role,
                          password,
                          email,
                          profilePicture
                        );
                        setIsAlertOpen(false);
                        onClose();
                      }}
                      ml={3}
                    >
                      Submit
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
