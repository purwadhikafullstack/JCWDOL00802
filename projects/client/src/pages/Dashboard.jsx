import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  AiFillDollarCircle,
  AiOutlineUser,
  AiOutlineShop,
  AiOutlineShopping,
  AiOutlineAppstoreAdd,
  AiOutlineStock,
  AiOutlineShoppingCart,
  AiOutlineCarryOut,
} from "react-icons/ai";
import { API_URL } from "../helper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, value, icon }) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Stat>
            <StatLabel>{title}</StatLabel>
            <StatNumber>{value}</StatNumber>
          </Stat>
        </Box>
        <Box as={icon} fontSize="3xl" />
      </Flex>
    </Box>
  );
};
const Dashboard = () => {
  const [data, setData] = useState({});
  const { id_user, userRole } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      userRole: state.userReducer.role,
    };
  });
  let userToken = localStorage.getItem("cnc_login");
  let navigate = useNavigate();
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("cnc_login");
      const apiEndpoints = [
        { key: "totalUsersAndAdmins", path: "/total-users", role: [3] },
        { key: "totalIncome", path: "/total-income", role: [2, 3] },
        {
          key: "totalWarehousesWithoutAdmin",
          path: "/total-warehouses-withoutadmin",
          role: [3],
        },
        { key: "totalOrders", path: "/total-orders", role: [2, 3] },
        { key: "pendingRequests", path: "/pending-requests", role: [2] },
        { key: "emptyStock", path: "/empty-stock", role: [2] },
        { key: "newOrdersCount", path: "/new-orders", role: [2] },
        { key: "readyToShipmentCount", path: "/ready-for-shipment", role: [2] },
      ];

      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      const data = {};
      for (const endpoint of apiEndpoints) {
        if (endpoint.role.includes(userRole)) {
          const response = await fetch(
            `${API_URL}/apis/dashboard${endpoint.path}`,
            {
              headers,
            }
          );
          const result = await response.json();

          // Check for result.success property
          if (result.success === false) {
            continue;
          }

          switch (endpoint.key) {
            case "totalUsersAndAdmins":
              if (userRole === 3) {
                data.totalUsers = result.totalUsers;
                data.totalWarehouseAdmins = result.totalWarehouseAdmins;
                data.totalWarehouses = result.totalWarehouses;
              }
              break;
            case "totalIncome":
              if (userRole === 2) {
                data.totalIncome =
                  result.totalIncome.length > 0
                    ? result.totalIncome[0].total_income
                    : 0;
              } else if (userRole === 3) {
                data.totalIncomeAllWarehouses =
                  result.totalIncomeAllWarehouses || 0;
              }
              break;
            case "totalWarehousesWithoutAdmin":
              data.totalWarehousesWithoutAdmin =
                result.totalWarehousesWithoutAdmin;
              break;
            case "totalOrders":
              if (userRole === 2) {
                data.totalOrders =
                  result.totalOrders.length > 0
                    ? result.totalOrders[0].total_orders
                    : 0;
              } else if (userRole === 3) {
                data.allWarehousesTotalOrders =
                  result.allWarehousesTotalOrders || 0;
              }
              break;
            case "pendingRequests":
              data.pendingRequests = result.totalPendingRequests;
              break;
            case "emptyStock":
              data.emptyStock = result.emptyStockProducts.length;
              break;
            case "newOrdersCount":
              data.newOrdersCount = result.newOrdersCount;
              break;
            case "readyToShipmentCount":
              data.readyToShipmentCount = result.readyToShipmentCount;
              break;
            default:
          }
        }
      }

      setData(data);
    };

    fetchData();
  }, [userRole]);

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Dashboard Admin";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);
  useEffect(() => {
    let admin = [2, 3];
    if (!userToken) {
      navigate("/login");
    } else if (role && !admin.includes(role)) {
      navigate("/");
    }
  }, [role, userToken]);
  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };

  return (
    <Flex
      flexDirection="column"
      pt={{ base: "120px", md: "75px" }}
      className="paddingmain"
    >
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 5 }} spacing={4}>
        {userRole === 3 && (
          <>
            <DashboardCard
              title="Total Users"
              value={data.totalUsers || 0}
              icon={AiOutlineUser}
            />
            <DashboardCard
              title="Total Warehouse Admins"
              value={data.totalWarehouseAdmins || 0}
              icon={AiOutlineUser}
            />
            <DashboardCard
              title="Total Warehouses"
              value={data.totalWarehouses || 0}
              icon={AiOutlineShop}
            />
            <DashboardCard
              title="Total Warehouses Without Admin"
              value={data.totalWarehousesWithoutAdmin || 0}
              icon={AiOutlineShop}
            />
          </>
        )}
        <DashboardCard
          title="Total Income"
          value={new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(
            userRole === 2
              ? data.totalIncome || 0
              : data.totalIncomeAllWarehouses || 0
          )}
          icon={AiFillDollarCircle}
        />
        <DashboardCard
          title="Total Orders"
          value={
            userRole === 2
              ? data.totalOrders || 0
              : data.allWarehousesTotalOrders || 0
          }
          icon={AiOutlineShopping}
        />
        {userRole === 2 && (
          <DashboardCard
            title="Pending Requests"
            value={data.pendingRequests || 0}
            icon={AiOutlineAppstoreAdd}
          />
        )}
        {userRole === 2 && (
          <DashboardCard
            title="Empty Stock Products"
            value={data.emptyStock || 0}
            icon={AiOutlineStock}
          />
        )}
        {userRole === 2 && (
          <>
            <DashboardCard
              title="New Orders"
              value={data.newOrdersCount || 0}
              icon={AiOutlineShoppingCart}
            />
            <DashboardCard
              title="Ready for Shipment"
              value={data.readyToShipmentCount || 0}
              icon={AiOutlineCarryOut}
            />
          </>
        )}
      </SimpleGrid>
    </Flex>
  );
};

export default Dashboard;
