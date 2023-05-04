import React, { useEffect } from "react";
import Axios from "axios";
import {
  Button,
  ButtonGroup,
  Text,
  Textarea,
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import { API_URL } from "../../helper";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  ModalFooter,
  Alert,
  AlertIcon,
  Box,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const NewAddressModal = (props) => {
  const [isDefault, setIsDefault] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detailAddressEdit, setDetailAddressEdit] = React.useState("");
  const [recipientNameEdit, setRecipientNameEdit] = React.useState("");
  const [phoneNumberEdit, setPhoneNumberEdit] = React.useState("");
  const [cityEdit, setCityEdit] = React.useState("");
  const [provinceEdit, setProvinceEdit] = React.useState("");
  const [postalCodeEdit, setPostalCodeEdit] = React.useState("");
  const [keyCityEdit, setKeyCityEdit] = React.useState("");
  const [keyProvinceEdit, setKeyProvinceEdit] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState(null);
  const [provinceList, setProvinceList] = React.useState(null);
  const [cityList, setCityList] = React.useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const validationSchema = Yup.object({
    recipientName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "Only alpha characters allowed")
      .max(50, "Recipient name must be 50 characters or less")
      .required("Recipient name is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{1,15}$/, "Only numbers allowed, up to 15 digits")
      .required("Phone number is required"),
    detailAddress: Yup.string()
      .max(200, "Detail address must be 200 characters or less")
      .required("Detail address is required"),
  });

  const initialValues = {
    recipientName: "",
    phoneNumber: "",
    detailAddress: "",
  };

  const ErrorText = (props) => {
    return <Text fontSize="sm" color="red.500" {...props} />;
  };

  let onGetProvince = async () => {
    try {
      let response = await Axios.get(API_URL + `/apis/rajaongkir/getprovince`);
      setProvinceList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  let onGetCity = async (idprop) => {
    try {
      setKeyProvinceEdit(idprop);
      let response = await Axios.get(
        API_URL + `/apis/rajaongkir/getcityaddress`
      );
      let kota = response.data;
      let container = [];
      kota.map((val, idx) => {
        if (val.province_id == idprop) {
          container.push(kota[idx]);
        }
      });
      setCityList(container);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetProvince();
  }, []);

  const onSubmit = (values) => {
    Axios.post(
      API_URL + `/apis/address/add`,
      {
        city: selectedCity?.city_name,
        province: selectedCity?.province,
        postal_code: selectedCity?.postal_code,
        detail_address: detailAddressEdit,
        receiver: recipientNameEdit,
        phone_number: phoneNumberEdit,
        key_city: selectedCity?.city_id,
        key_province: selectedCity?.province_id,
        priority: isDefault ? 1 : 0,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cnc_login")}`,
        },
      }
    )
      .then((response) => {
        setIsSuccess(true); // Show success alert
        props.onAddressListRefresh(); // Trigger the address list refresh

        setDetailAddressEdit("");
        setRecipientNameEdit("");
        setPhoneNumberEdit("");
        setCityEdit("");
        setProvinceEdit("");
        setPostalCodeEdit("");
        setKeyCityEdit("");
        setKeyProvinceEdit("");
        setSelectedCity(null);
        setIsDefault(false);
        setTimeout(() => {
          setIsSuccess(false); // Hide success alert
          onClose();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let dataProvinceExist = false;
  if (provinceList == null) {
    dataProvinceExist = false;
  } else {
    dataProvinceExist = true;
  }

  const printDataProvince = () => {
    let data = dataProvinceExist ? provinceList : [];
    return data.map((val, idx) => {
      return <option value={val.province_id}>{val.province}</option>;
    });
  };

  let dataCityExist = false;
  if (cityList == null) {
    dataCityExist = false;
  } else {
    dataCityExist = true;
  }

  const printDataCity = () => {
    let data = dataCityExist ? cityList : [];
    return data.map((val, idx) => {
      return (
        <option value={val.city_id}>
          {val.type} {val.city_name}
        </option>
      );
    });
  };

  let onGetPostal = async (keyCity) => {
    try {
      let data = cityList;
      let filterData = data.filter((x) => {
        return x.city_id == keyCity;
      });
      setSelectedCity(filterData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box mt={2}>
        <Button onClick={onOpen} colorScheme="orange" variant="solid">
          Add New Address
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Address</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isValid, errors, touched, getFieldProps }) => (
              <Form>
                <ModalBody>
                  <FormControl
                    id="recipientName"
                    mb="4"
                    isInvalid={errors.recipientName && touched.recipientName}
                  >
                    <FormLabel>Recipient Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Recipient Name"
                      {...getFieldProps("recipientName")}
                      borderColor={
                        errors.recipientName && touched.recipientName
                          ? "red.500"
                          : undefined
                      }
                      onChange={(e) => {
                        getFieldProps("recipientName").onChange(e);
                        setRecipientNameEdit(e.target.value);
                      }}
                    />
                    <ErrorMessage name="recipientName" component={ErrorText} />
                  </FormControl>
                  <FormControl
                    id="phoneNumber"
                    mb="4"
                    isInvalid={errors.phoneNumber && touched.phoneNumber}
                  >
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="text"
                      placeholder="Phone Number"
                      {...getFieldProps("phoneNumber")}
                      borderColor={
                        errors.phoneNumber && touched.phoneNumber
                          ? "red.500"
                          : undefined
                      }
                      onChange={(e) => {
                        getFieldProps("phoneNumber").onChange(e);
                        setPhoneNumberEdit(e.target.value);
                      }}
                    />
                    <ErrorMessage name="phoneNumber" component={ErrorText} />
                  </FormControl>
                  <FormControl
                    id="detailAddress"
                    mb="4"
                    isInvalid={errors.detailAddress && touched.detailAddress}
                  >
                    <FormLabel>Detail Address</FormLabel>
                    <Textarea
                      resize="vertical"
                      type="text"
                      className="form-control p-3"
                      placeholder="DESC"
                      {...getFieldProps("detailAddress")}
                      borderColor={
                        errors.detailAddress && touched.detailAddress
                          ? "red.500"
                          : undefined
                      }
                      onChange={(e) => {
                        getFieldProps("detailAddress").onChange(e);
                        setDetailAddressEdit(e.target.value);
                      }}
                    />
                    <ErrorMessage name="detailAddress" component={ErrorText} />
                  </FormControl>
                  <FormControl id="province" mb="4">
                    <FormLabel>Provinsi</FormLabel>
                    <Select onChange={(e) => onGetCity(e.target.value)}>
                      <option>Pilih Provinsi</option>
                      {printDataProvince()}
                    </Select>
                  </FormControl>
                  <FormControl id="city" mb="4">
                    <FormLabel>Kota</FormLabel>
                    <Select onChange={(e) => onGetPostal(e.target.value)}>
                      <option>Pilih Kota</option>
                      {printDataCity()}
                    </Select>
                  </FormControl>
                  <FormControl id="postalCode" mb="4">
                    <FormLabel>Postal Code</FormLabel>
                    {selectedCity !== null && (
                      <Input
                        type="text"
                        className="form-control p-3"
                        placeholder="Kode pos"
                        value={selectedCity.postal_code}
                        disabled
                      />
                    )}
                    {selectedCity == null && (
                      <Input
                        type="text"
                        className="form-control p-3"
                        placeholder="Kode pos"
                        disabled
                      />
                    )}
                  </FormControl>
                  {isSuccess && (
                    <Alert status="success" mb="4">
                      <AlertIcon />
                      Address successfully added!
                    </Alert>
                  )}
                  <Checkbox
                    mb="4"
                    isChecked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                  >
                    Make this the default address
                  </Checkbox>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="orange"
                    variant="solid"
                    isDisabled={!isValid}
                  >
                    Add Address
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewAddressModal;
