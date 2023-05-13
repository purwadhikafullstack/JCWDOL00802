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
 selectedOrder,
 selectedSort,
 setOrder,
 setSort,
 Sort
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [resetDisable, setResetDisable] = useState(true);
  const [yearList, setYearList] = useState([]);
 

  const month = [
    { value: "", name: "Bulan" },
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
    let dataYear = [{label:"Tahun", value :""}];
    for (let i = parseInt(year); i >= baseYear; i--) {
      dataYear.push({label :i, value:i});
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
    setSelectedWarehouse(event.target.value)
    setResetDisable(false)
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setResetDisable(false)
  };
  const handleMonth = (event) => {
    setSelectedMonth(event.target.value);
    setResetDisable(false)
  };
  const handleYear = (event) => {
    setSelectedYear(event.target.value);
    setResetDisable(false)
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
  const handleResetFilterClick = () => {
    setSearchTerm("");
    setSelectedYear("");
    setSelectedMonth("");
    if(warehouses?.length> 1){
      setSelectedWarehouse("");
    }
    setSelectedCategory("");
    setResetDisable(true);
    
    
  }
  let sortData = [
    {label:"id",value:"id_product"},
    {value:"name",label:"nama"}
  ]
  useEffect(() => {
    if (resetDisable) {
      handleFilterClick();
    }
  }, [resetDisable]);
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
        <Select  onChange={handleYear}>
          {yearList.map((year) => (
            <option key={year.value} value={year.value} selected={year.value == selectedYear}>
              {year.label}
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
        <Select onChange={handleWarehouseChange}isDisabled={warehouses?.length ==1}>
            {warehouses?.map((warehouse) => (
              <option
                key={warehouse.id_warehouse}
                value={warehouse.id_warehouse}
                selected ={warehouse.id_warehouse == selectedWarehouse}
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
          variant={buttonDisable? "ghost":"outline"}
        >
          Terapkan filter
        </Button>
        <Button colorScheme="orange" onClick={handleResetFilterClick} isDisabled={resetDisable} variant={resetDisable? "ghost":"outline"}>
        Reset Filter
      </Button>
      <Stack direction="row" spacing={4} align="center">
  <FormControl>
    <Select onChange={(e) => setSort(e.target.value)}>
      {Sort?.map((option) => (
        <option key={option.value} value={option.value} selected={option.value == selectedSort}>
          {option.label}
        </option>
      ))}
    </Select>
  </FormControl>
  <FormControl>
    <Select onChange={(e) => setOrder(e.target.value)}>
      {[{label:"A-Z",value:"asc"}, {label:"Z-A",value: "desc"}].map((option) => (
        <option key={option} value={option.value} selected={option.value == selectedOrder} >
          {option.label}
        </option>
      ))}
    </Select>
  </FormControl>
</Stack>
      </Stack>
    </Box>
  );
};

export default SalesFilter;
