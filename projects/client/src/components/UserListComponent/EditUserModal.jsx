import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Stack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../helper";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const UserSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .required("Required"),
  fullName: Yup.string()
    .matches(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric characters")
    .max(90, "Must be 90 characters or less")
    .required("Required"),
});

export default function EditUserModal({
  id_user,
  isOpen,
  onClose,
  setUpdateTrigger,
  updateTrigger,
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const cancelRef = React.useRef();
  const toast = useToast();
  const [formikRef, setFormikRef] = useState(null); 
  const getUserDetail = async () => {
    try {
      const response = await axios.get(
        API_URL + `/apis/user/user?id_user=${id_user}`
      );
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
      setPhoneNumber(fetchedUserData.phone_number || '');
      setFullName(fetchedUserData.full_name || '');
    }
  }, [fetchedUserData]);

  useEffect(() => {
    if (isOpen) {
      getUserDetail();
    }
  }, [isOpen]);

  const handleEditUser = async (phoneNumber, fullName) => {
    const data = {
      target_id_user: id_user,
      phone_number: phoneNumber,
      full_name: fullName,
    };
    try {
      const response = await axios.post(
        API_URL + `/apis/user/edituser`,
        data, 
        {
          headers: {
            "Content-Type": "application/json",
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
  useEffect(() => {
    console.log("id_user prop:", id_user);
  }, [id_user]);

  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detail Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                phoneNumber: fetchedUserData
                  ? fetchedUserData.phone_number
                  : "",
                fullName: fetchedUserData ? fetchedUserData.full_name : "",
              }}
              validationSchema={UserSchema}
              onSubmit={(values) => {
                handleEditUser(values.phoneNumber, values.fullName);
              }}
            >
              {({ isSubmitting, isValid, dirty, touched, errors }) => (
                <Form>
                  <Stack spacing={4}>
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
                    <Field name="fullName">
                      {({ field, form }) => (
                        <FormControl
                          id="fullName"
                          isInvalid={
                            form.errors.fullName && form.touched.fullName
                          }
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
                  </Stack>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="orange"
                      isDisabled={!(dirty && isValid)}
                      _disabled={{ color: "gray.400", cursor: "not-allowed" }}
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
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
