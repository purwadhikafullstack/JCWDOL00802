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

const StockFilter = ({
  warehouses,
  type,
  handleFilter,
  selectedOrder,
 selectedSort,
 setOrder,
 setSort,

 
}) => {
  
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedType,setSelectedType]=useState("")
  const [resetDisable, setResetDisable] = useState(true)
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
  let Sort = [{label:"tanggal",value:"date"},{label:"tipe transaksi",value:"type"},{label:"gudang",value:"id_warehouse"},{label:"jumlah barang",value:"amount"}]
  const handleResetFilterClick = () => {
    
    setSelectedYear("");
    setSelectedMonth("")
    setSelectedType("")
    if(warehouses?.length> 1){
      setSelectedWarehouse("");
    }
    
    
  }

  useEffect(() => {
    if(!selectedMonth && !selectedType && !selectedWarehouse && !selectedYear){
      setResetDisable(true)
    }else{ setResetDisable(false)}
  }, [selectedMonth,selectedWarehouse,selectedYear,selectedType])
  useEffect(() => {
    if (resetDisable) {
      handleFilterClick();
    }
  }, [resetDisable]);
  
  const validatedYear = () => {
   
    if (!selectedMonth && selectedYear) {
      setButtonDisable(true);
    } else if (selectedMonth && !selectedYear) {
      setButtonDisable(true);
    } else {setButtonDisable(false)};
  };
  const yearListDefault = () => {
    const year = new Date().getFullYear();
    let baseYear = 2022;
    let dataYear = [{label:"year", value :""}];
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
  }, [selectedMonth, selectedYear]);

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value)
    
  };

  const handleCategoryChange = (event) => {
    setSelectedType(event.target.value);
  };
  const handleMonth = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handleYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleFilterClick = () => {
    const filters = {
     
      selectedYear,
      selectedMonth,
      warehouseFilter: selectedWarehouse,
      selectedType
      
    };

    handleFilter(filters);
  };

  return (
    <Box p={4} boxShadow="base" borderRadius="md">
      <Stack spacing={4}>
        
        <Select onChange={handleYear}>
          {yearList.map((year) => (
            <option key={year} value={year.value} selected={year.value==selectedYear}>
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
          <Select  onChange={handleCategoryChange} >
            {type?.map((type) => (
              <option key={type.type} value={type.type} selected={type.type == selectedType}>
                {type.description}
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
        <Button colorScheme="orange" onClick={handleResetFilterClick} isDisabled={resetDisable} variant={resetDisable? "ghost":"outline"}>
        Reset Filter
      </Button>
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
      <div>{selectedMonth}</div>
      <div>{selectedYear}</div>
    </Box>
  );
};

export default StockFilter;
