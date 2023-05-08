import { useState } from "react";
import { Badge, Box, Button, Flex, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const WishlistItem = ({ product, isAdded, onAdd, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleAdd = () => onAdd(product);
  const handleRemove = () => onRemove(product);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      m={2}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex alignItems="center">
        <Image src={product?.image} alt={product?.name} boxSize="100px" objectFit="contain" mr={4} />

        <Stack flex={1} spacing={2}>
          <Text fontWeight="bold">{product?.name}</Text>
          <Text color="gray.500">{product?.description}</Text>
          <Text fontWeight="bold">Rp {product?.price}</Text>
        </Stack>

        <IconButton
          icon={isAdded ? <FaHeart color="red" /> : <FaRegHeart />}
          variant="ghost"
          onClick={isAdded ? handleRemove : handleAdd}
          aria-label={isAdded ? "Remove from wishlist" : "Add to wishlist"}
          _hover={{ background: "none" }}
        />
      </Flex>

      {isHovered && (
        <Stack mt={4} spacing={2} direction="row" justifyContent="flex-end">
          <Button variant="outline" colorScheme="teal" size="sm">
            Beli Sekarang
          </Button>
          <Button variant="solid" colorScheme="teal" size="sm">
            Tambah ke Keranjang
          </Button>
        </Stack>
      )}

      {isAdded && (
        <Badge colorScheme="red" mt={2}>
          Sudah Ditambahkan ke Wishlist
        </Badge>
      )}
    </Box>
  );
};

export default WishlistItem;
