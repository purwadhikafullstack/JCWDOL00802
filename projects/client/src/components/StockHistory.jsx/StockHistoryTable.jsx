import { Table, Tbody, Tr, Th, Td, Box,Thead,Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function StockHistoryTable({ data }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Table size="md">
        <Thead bg="#FFA500">
          <Tr>
            <Th color="#FFFFFF">Nama Produk</Th>
            <Th color="#FFFFFF">stock Masuk</Th>
            <Th color="#FFFFFF">stock Keluar</Th>
            <Th color="#FFFFFF">Stock akhir</Th>
          </Tr>
        </Thead>
        <Tbody bg="#FFECDB">
          {data?.map((val, idx) => (
            <Tr key={idx} >
              <Td color="#707070">
                <Link to = {`/admin/stockhistory/${val.id_product}`}>
                {val.name}</Link>
                </Td>
              <Td color="#707070">{val.In}</Td>
              <Td color="#707070">{val.out}</Td>
              <Td color="#707070">{val.last}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {data?.length <= 0 &&
        <Flex justifyContent="center" alignItems="center" height="100%">
        tidak ada data
      </Flex>
      }
    </Box>)
}
export default StockHistoryTable
