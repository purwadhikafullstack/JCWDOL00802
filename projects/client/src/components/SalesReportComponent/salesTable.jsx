import { Box, Table, Thead, Tbody, Tr, Th, Td ,Flex} from "@chakra-ui/react";

const TableSalesReport = ({ data }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Table size="md">
        <Thead bg="#FFA500">
          <Tr>
            <Th color="#FFFFFF">Nama Produk</Th>
            <Th color="#FFFFFF">Pendapatan</Th>
            <Th color="#FFFFFF">Terjual</Th>
            <Th color="#FFFFFF">Pesanan</Th>
          </Tr>
        </Thead>
        <Tbody bg="#FFECDB">
          {data?.map((val, idx) => (
            <Tr key={idx}>
              <Td color="#707070">{val.name}</Td>
              <Td color="#707070">Rp.{val.total_biaya.toLocaleString()}</Td>
              <Td color="#707070">{val.jumlah}</Td>
              <Td color="#707070">{val.total_pesanan}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {data?.length <= 0 &&
        <Flex justifyContent="center" alignItems="center" height="100%">
        tidak ada data
      </Flex>
      }
    </Box>
  );
};

export default TableSalesReport;
