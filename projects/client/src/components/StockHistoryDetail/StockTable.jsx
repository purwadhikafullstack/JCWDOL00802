import { Box, Table, Thead, Tbody, Tr, Th, Td ,Flex} from "@chakra-ui/react";
import { format } from "date-fns";
const TableDetailReport = ({ data }) => {
    
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Table size="md">
        <Thead bg="#FFA500">
          <Tr>
            
            <Th color="#FFFFFF">Date</Th>
            <Th color="#FFFFFF">type</Th>
            <Th color="#FFFFFF">jumlah</Th>
          </Tr>
        </Thead>
        <Tbody bg="#FFECDB">
          {data?.map((val, idx) => (
            <Tr key={idx}>
              
              <Td color="#707070">{format(new Date(val.date), "yyyy-MM-dd hh:mm a")}</Td>
              <Td color="#707070">{val.Stock_history_type.description}</Td>
              <Td color="#707070">{val.amount}</Td>
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

export default TableDetailReport;
