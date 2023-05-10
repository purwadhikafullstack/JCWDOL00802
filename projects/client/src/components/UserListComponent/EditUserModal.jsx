import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Select,
  InputGroup,
  InputRightElement,
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
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { API_URL } from "../../helper";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function EditUserModal({ id_user, isOpen, onClose, setUpdateTrigger, updateTrigger }) {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const cancelRef = React.useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [fetchedUserData, setFetchedUserData] = useState(null);


  const getUserDetail = async () => {
    try {
      const response = await axios.get(API_URL + `/apis/user/user?id_user=${id_user}`);
      const userData = response.data.data; 
      if (userData) {
        setFetchedUserData(userData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  useEffect(() => {
    if (fetchedUserData) {
      console.log("Setting form fields with fetched user data:", fetchedUserData);
      setUsername(fetchedUserData.username || '');
      setPhoneNumber(fetchedUserData.phone_number || '');
      setFullName(fetchedUserData.full_name || '');
      setRole(fetchedUserData.role || '');
      setProfilePictureURL(fetchedUserData.profile_picture || '');
    }
  }, [fetchedUserData]);
  

  useEffect(() => {
    if (isOpen) {
      getUserDetail();
    }
  }, [isOpen]);
  

  const handleEditUser = async (
    username,
    phoneNumber,
    fullName,
    role,
    profile_picture
  ) => {
    const formData = new FormData();
    formData.append("target_id_user", id_user);
    formData.append("username", username);
    formData.append("phone_number", phoneNumber);
    formData.append("full_name", fullName);
    formData.append("role", role);
    if (profilePicture !== null) {
      formData.append("profile_picture", profilePicture);
    }
    try {
      const response = await axios.post(
        API_URL + `/apis/user/edituser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("Profile updated successfully");
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
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
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setProfilePictureURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toast = useToast();
  const navigate = useNavigate();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Profile Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack as="form" onSubmit={handleEditUser} spacing={4}>
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
                        onClick={() => {
                          setProfilePicture(null);
                          setProfilePictureURL("");
                        }}
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
                  onChange={(e) => setRole(Number(e.target.value))} // Convert the value to a number
                  placeholder="Select Role"
                >
                  <option value="1">User</option>
                  <option value="2">Warehouse Admin</option>
                </Select>
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
                    Submit Changes
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to submit the changes?
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
                        handleEditUser(
                          username,
                          phoneNumber,
                          fullName,
                          role,
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
