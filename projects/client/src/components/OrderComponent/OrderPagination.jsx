import { Button, Flex, Stack, Text, Select, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function PaginationOrder({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  maxLimit
}) {

  const [isLastPage,setIsLastPage]=useState(false)
  const [isFirstPage,setIsFirtsPage]=useState(false)
  const [listLimit,setListLimit]=useState([])
  const handlePrevPage = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };
  useEffect(() => {
    if(currentPage === 1){
        setIsFirtsPage(true)
    }else{setIsFirtsPage(false)}
  if (currentPage === totalPages || totalPages===0){
    setIsLastPage(true)
  }else{setIsLastPage(false)}
  }, [totalPages])

  useEffect(() => {
    if(maxLimit != 0){
      let tempt =[]
      for (let index = 0; index <= maxLimit; index+=5) {
        if (index != 0){
          tempt.push(index)
        }
        
      }
      setListLimit(tempt)
    }
  }, [])
  
  return (
    <Flex justify="center" align="center" my={6}>
      <Stack direction="row" spacing={4}>
        <Button
          isDisabled={isFirstPage}
          variant={isFirstPage ? "subtle" : "outline"}
          onClick={handleFirstPage}
          colorScheme="orange"
          size="sm"
        >
          First
        </Button>
        <Button
          isDisabled={isFirstPage}
          onClick={handlePrevPage}
          variant={isFirstPage ? "subtle" : "outline"}
          colorScheme="orange"
          size="sm"
        >
          Prev
        </Button>
        <Button
          key={1}
          onClick={() => onPageChange(currentPage - 2)}
          isDisabled={currentPage - 2 <= 0}
          variant={currentPage - 2 <= 0 ? "subtle" : "outline"}
          colorScheme="orange"
          size="sm"
        >
          {currentPage - 2 <= 0 ? "..." : currentPage - 2}
        </Button>
        <Button
          key={2}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage - 1 <= 0}
          variant={currentPage - 1 <= 0 ? "subtle" : "outline"}
          colorScheme="orange"
          size="sm"
        >
          {currentPage - 1 <= 0 ? "..." : currentPage - 1}
        </Button>
        <Button
          key={3}
          onClick={() => onPageChange(currentPage)}
          disabled={currentPage}
          variant="solid"
          colorScheme="orange"
          size="sm"
        >
          {currentPage}
        </Button>
        <Button
          key={4}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage + 1 > totalPages}
          variant={currentPage + 1 > totalPages ? "subtle" : "outline"}
          colorScheme="orange"
          size="sm"
        >
          {currentPage + 1 > totalPages ? "..." : currentPage + 1}
        </Button>
        <Button
          key={5}
          onClick={() => onPageChange(currentPage + 2)}
          isDisabled={currentPage + 2 > totalPages}
          variant={currentPage + 2 > totalPages ? "subtle" : "outline"}
          colorScheme="orange"
          size="sm"
        >
          {currentPage + 2 > totalPages ? "..." : currentPage + 2}
        </Button>

        <Button
          onClick={handleNextPage}
          colorScheme="orange"
          size="sm"
          isDisabled={isLastPage}
          variant={isLastPage ? "subtle" : "outline"}
        >
          Next
        </Button>
        <Button
          onClick={handleLastPage}
          colorScheme="orange"
          size="sm"
          isDisabled={isLastPage}
          variant={isLastPage ? "subtle" : "outline"}
        >
          Last
        </Button>
      </Stack>
      { maxLimit !=0 &&
      <Flex mx={3}align="center" justify="flex-end" position="relative">
        <Text mx={2}>Show:</Text>
        <Select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          size="sm"
          w="auto"
          mx={2}
        >
          {listLimit.map(option => (
    <option key={option} value={option.value}>{option}</option>
  ))}
        </Select>
        <Text mx={2}>entries</Text>
      </Flex>}
    </Flex>
  );
}
export default PaginationOrder;
