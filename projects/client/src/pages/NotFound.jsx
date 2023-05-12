import React from "react";
import { Box, Center, Heading, Text, Button} from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };
  return (
    <Box bg="white" h="100%">
      <Container>
        <Center h="100%">
          <Box textAlign="center" color="orange">
            <Heading as="h1" mb={6} fontSize="6xl">
              404 Not Found
            </Heading>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
              Oops! Looks like the page you are looking for doesn't exist.
            </Text>
            <Text fontSize="xl" mb={6}>
              Please check the URL or go back to the homepage.
            </Text>
            <Button onClick={handleBackHome} colorScheme="orange">
              Back to Home
            </Button>
          </Box>
        </Center>
      </Container>
    </Box>
  );
};

export default NotFound;
