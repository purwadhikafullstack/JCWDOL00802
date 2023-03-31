import { Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="bg-white my-5 w-100 p-5 m-auto shadow">
      <Text>Oops! Not Found</Text>
      <Button
        onClick={() => {
          navigate("/");
        }}
      >
        Ke Halaman Utama
      </Button>
    </div>
  );
}
