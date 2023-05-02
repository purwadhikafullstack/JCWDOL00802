import { Box, Flex, Text } from '@chakra-ui/react';

const ReportSalesTop = ({ pendapatan, total_barang, total_pesanan }) => {
  return (
    <Flex>
      <Box
        bg="purple"
        color="white"
        roundedTop="md"
        roundedBottomLeft="md"
        p="2"
        boxShadow="md"
      >
        <Text fontWeight="bold">Total Penjualan</Text>
      </Box>
      <Box
        flex="1"
        bg="gray.100"
        p="2"
        roundedTopRight="md"
        roundedBottom="md"
        boxShadow="md"
      >
        <Text fontWeight="bold" mb="1" color="#FFA500">
          {pendapatan}
        </Text>
        <Text color="gray.500" fontSize="sm">
          Rp {pendapatan} dari {total_pesanan} pesanan
        </Text>
      </Box>
      <Box
        bg="purple"
        color="white"
        roundedTop="md"
        roundedBottomLeft="md"
        p="2"
        boxShadow="md"
        ml="4"
      >
        <Text fontWeight="bold">Total Barang</Text>
      </Box>
      <Box
        flex="1"
        bg="gray.100"
        p="2"
        roundedTopRight="md"
        roundedBottom="md"
        boxShadow="md"
      >
        <Text fontWeight="bold" mb="1" color="#FFA500">
          {total_barang}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {total_pesanan} pesanan dengan total {total_barang} barang
        </Text>
      </Box>
    </Flex>
  );
};

export default ReportSalesTop;
