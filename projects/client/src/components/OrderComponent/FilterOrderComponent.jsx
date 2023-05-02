import { useEffect, useState } from 'react';
import { Input, Button, Table ,Select,Flex} from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';

function FilterOrderList({data,handleMonthFilter,handleSearch,handleStatusFilter,handleYearFilter,searchText,statusFilter,monthFilter,yearFilter,setSearchText,handleKey}) {

  
  const [yearList,setYearList]=useState([])
  

  const monthList = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "July",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ]
          
  const yearListDefault =()=>{
    const year = new Date().getFullYear()
    let baseYear= 2022
    let dataYear=[]
    for (let i = parseInt(year); i >= baseYear; i--) {
        dataYear.push(i);
      }
      setYearList(dataYear)
  }    

    useEffect(() => {
      yearListDefault()
    }, [])
       
 

  

  return (
    <div>
      <Flex align="center" mb={4}>
        
      <Input placeholder="Search" width="280px" mr={2} onChange={(e) => setSearchText(e.target.value)} onKeyDown={handleKey}/>
        <Button colorScheme="orange" mr={2} onClick={() => handleSearch(searchText)}>
          <BiSearch />
        </Button>
        <Button variant={statusFilter == '' ? 'solid' : 'outline'} colorScheme='orange' mr={2} onClick={() => handleStatusFilter('')}>
          All Transactions
        </Button>
        <Button variant={statusFilter === 'ongoing' ? 'solid' : 'outline'} colorScheme='orange'mr={2} onClick={() => handleStatusFilter('ongoing')}>
          Ongoing
        </Button>
        <Button variant={statusFilter === '7' ? 'solid' : 'outline'}colorScheme='orange' mr={2} onClick={() => handleStatusFilter('7')}>
          Success
        </Button>
        <Button variant={statusFilter === '9' ? 'solid' : 'outline'}colorScheme='orange' onClick={() => handleStatusFilter('9')}>
          Failed
        </Button>
        <Select placeholder="Filter by month"width="150px" value={monthFilter} onChange={handleMonthFilter} mr={2}className='col-auto'>
        {monthList.map((month,idx) => (
            <option key={idx} value={idx+1} selected ={(idx+1)===monthFilter}>
              {month}
            </option>
          ))}

        </Select>
        <Select placeholder="Filter by year" width="150px"value={yearFilter} onChange={handleYearFilter} mr={2} className='col-auto'>
        {yearList.map((val,idx) => (
            <option key={val} value={val} selected ={(val)===yearFilter}>
              {val}
            </option>
          ))}
        </Select>
      </Flex>
      </div>)
      }
export default FilterOrderList