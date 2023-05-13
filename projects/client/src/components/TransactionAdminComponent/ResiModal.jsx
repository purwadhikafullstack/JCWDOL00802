import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema
const ResiSchema = Yup.object().shape({
  resi: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, 'Only alphanumeric characters')
    .max(40, 'Must be 40 characters or less')
    .required('Required'),
});

const ResiModal = ({ isOpen, onClose, title, acceptLabel, onAccept, showResiInput }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ resi: '' }}
            validationSchema={ResiSchema}
            onSubmit={(values) => {
              if (showResiInput) {
                onAccept(values.resi);
              } else {
                onAccept();
              }
            }}
          >
            {({ isSubmitting, isValid, dirty, touched, errors }) => (
              <Form>
                <VStack>
                  {showResiInput && (
                    <Field name="resi">
                      {({ field, form }) => (
                        <FormControl id="resi" isInvalid={form.errors.resi && form.touched.resi}>
                          <FormLabel>Resi Number</FormLabel>
                          <Input type="text" {...field} />
                          <FormErrorMessage>
                            <ErrorMessage name="resi" />
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  )}
                  <Button 
                    colorScheme="blue" 
                    type="submit" 
                    isDisabled={isSubmitting || !(dirty && isValid) || (touched.resi && errors.resi)}
                    style={{ cursor: isSubmitting || !(dirty && isValid) || (touched.resi && errors.resi) ? 'not-allowed' : 'pointer' }}
                  >
                    {acceptLabel}
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ResiModal;
