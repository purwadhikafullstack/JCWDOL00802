import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  FormControl,
  InputGroup,
  Select,
  Stack,
  Input,
} from "@chakra-ui/react";

const SalesFilter = ({
  warehouses,
  categories,
  handleFilter,
  year,
  defaultMonth,
  defaultYear,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [yearList, setYearList] = useState([]);

  const month = [
    { value: "", name: "Month" },
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const validatedYear = () => {
    if (!selectedMonth && selectedYear) {
      setButtonDisable(true);
    } else if (selectedMonth && !selectedYear) {
      setButtonDisable(true);
    } else setButtonDisable(false);
  };
  const yearListDefault = () => {
    const year = new Date().getFullYear();
    let baseYear = 2022;
    let dataYear = [];
    for (let i = parseInt(year); i >= baseYear; i--) {
      dataYear.push(i);
    }
    setYearList(dataYear);
  };

  useEffect(() => {
    yearListDefault();
  }, []);
  useEffect(() => {
    validatedYear();
  }, [selectedMonth, selectedYear, warehouses]);

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleMonth = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handleYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleFilterClick = () => {
    const filters = {
      searchTerm,
      selectedYear,
      selectedMonth,
      warehouseFilter: selectedWarehouse,
      categoryFilter: selectedCategory,
    };

    handleFilter(filters);
  };

  return (
    <Box p={4} boxShadow="base" borderRadius="md">
      <Stack spacing={4}>
        <InputGroup>
          <Input
            placeholder="Search"
            onChange={handleSearchTermChange}
            value={searchTerm}
          />
        </InputGroup>
        <Select placeholder="Year" onChange={handleYear}>
          {yearList.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>

        <FormControl>
          <Select onChange={handleMonth}>
            {month.map((month, idx) => (
              <option
                key={month.value}
                value={month.value}
                selected={month.value == selectedMonth}
              >
                {month.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select placeholder="Warehouse" onChange={handleWarehouseChange}>
            {warehouses?.map((warehouse) => (
              <option
                key={warehouse.id_warehouse}
                value={warehouse.id_warehouse}
              >
                {warehouse.warehouse_branch_name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select placeholder="Category" onChange={handleCategoryChange}>
            {categories?.map((category) => (
              <option key={category.id_category} value={category.id_category}>
                {category.category}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="orange"
          onClick={handleFilterClick}
          isDisabled={buttonDisable}
        >
          Terapkan filter
        </Button>
      </Stack>
    </Box>
  );
};

export default SalesFilter;
