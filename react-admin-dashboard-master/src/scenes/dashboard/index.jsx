import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import InventoryIcon from '@mui/icons-material/Inventory';
import PaidIcon from '@mui/icons-material/Paid';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from '@mui/icons-material/Receipt';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PieChart from "../../components/PieChart";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [weeklyTotalPrice, setWeeklyTotalPrice] = useState(0);
  const [monthlyTotalPrice, setMonthlyTotalPrice] = useState(0);
  const [totalBuyingPrice, setTotalBuyingPrice] = useState(0);
  const [dailyTotalPrice, setDailyTotalPrice] = useState([]);
  const [profit, setProfit] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState([])
  const [totalEarnings,setTotalEarnings]= useState(0)
  // ...

  useEffect(() => {
    axios.get("https://mobried-admin-panel.onrender.com/api/transactions")
      .then((response) => {
        const transactions = response.data;
        const numTransactions = transactions.length;
        const total = transactions.reduce(
          (acc, transaction) => acc + transaction.totalPrice,
          0
        );
        setTotalTransactions(numTransactions);
        console.log(total)
  
        // Filter transactions for today
        const today = new Date();
        const todayTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate.getDate() === today.getDate() &&
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });
  
        // Calculate total price for today's transactions
        const todayTotalPrice = todayTransactions.reduce(
          (acc, transaction) => acc + transaction.totalPrice,
          0
        );
  
        
        setDailyTotalPrice(todayTotalPrice);
  
        // Filter transactions for this week
        const firstDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const lastDayOfWeek = new Date(
          today.setDate(today.getDate() + (6 - today.getDay()))
        ); // Calculate last day of the week
        const weekTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate >= firstDayOfWeek &&
            transactionDate <= lastDayOfWeek
          );
        });
  
        // Calculate total price for this week's transactions
        const weekTotalPrice = weekTransactions.reduce(
          (acc, transaction) => acc + transaction.totalPrice,
          0
        );
  
        setWeeklyTotalPrice(weekTotalPrice);
  
        // Filter transactions for this month
        const monthTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });
  
        // Calculate total price for this month's transactions
        const monthTotalPrice = monthTransactions.reduce(
          (acc, transaction) => acc + transaction.totalPrice,
          0
        );
  
        setMonthlyTotalPrice(monthTotalPrice);
  
  
        // Calculate total buying price and profit
axios.get("https://mobried-admin-panel.onrender.com/api/products")
.then((response) => {
  const products = response.data;
  const totalBuyingPrice = products.reduce(
    (acc, product) => acc + product.buyingPrice * product.quantity,
    0
  );

  // Calculate profit for each transaction
  const profit = transactions.reduce((acc, transaction) => {
    const product = products.find((p) => p.id === transaction.productId);
    if (product) {
      const transactionProfit = (transaction.sellingPrice - product.buyingPrice) * transaction.quantity;
      return acc + transactionProfit;
    }
    return acc;
  }, 0);

  setTotalBuyingPrice(totalBuyingPrice);
  setProfit(profit);
})
.catch((error) => console.log(error));

      })
      .catch((error) => console.log(error));
  }, []);
  
  
  useEffect(() => {
    axios
      .get("https://mobried-admin-panel.onrender.com/api/users")
      .then((response) => {
        const users = response.data;
        console.log(users);
        const numUsers = users.count.total;
        setTotalUsers(numUsers);
      })
      .catch((error) => console.log(error));
  
    axios
      .get("https://mobried-admin-panel.onrender.com/api/products")
      .then((response) => {
        const products = response.data;
        const numProducts = products.length;
        setTotalProducts(numProducts);
      })
      .catch((error) => console.log(error));
  
    axios
      .get("https://mobried-admin-panel.onrender.com/api/transactions")
      .then((response) => {
        const transactions = response.data;
        const numTransactions = transactions.length
  ;
  setTotalTransactions(numTransactions);
  const total = transactions.reduce(
  (acc, transaction) => acc + transaction.totalPrice,
  0
  );
  setTotalEarnings(total);
  const latest = transactions.slice(-5); // Get the latest 5 transactions
  setLatestTransactions(latest);
  })
  .catch((error) => console.log(error));
  }, []);
  

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor:"#000000",
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
              title={totalUsers}
              subtitle="Users Active"
              progress="0.75"
              
              icon={
                <PersonAddIcon
                  sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
            title={totalProducts}
            subtitle="Products Available"
            progress="0.50"
            
            icon={
              <InventoryIcon
                sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
            title={totalTransactions}
            subtitle="Transactions Made"
            progress="0.30"
            
            icon={
              <ReceiptIcon
                sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
            title={totalEarnings}
            subtitle="Total Earnings (kshs)"
            progress="0.80"
            
            icon={
              <PaidIcon
                sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#000000"
          sx={{ borderRadius: '5px', boxShadow: 4 }}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color="#fff"
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="#52c234"
              >
                {totalEarnings}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: "#52c234" }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#000000"
          overflow="auto"
          sx={{ borderRadius: '5px', boxShadow: 4 }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            backgroundColor="#000000"
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color="#fff" variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {latestTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color="#fff"
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.productName}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.quantity}</Box>
              <Box
                color="#fff"
                p="5px 10px"
                borderRadius="4px"
              >
                Kshs {transaction.totalPrice}
              </Box>
              
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#000000"
          p="20px"
        >
          <Typography 
            variant="h5" 
            fontWeight="900"
          >
            STATISTICS
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt="5px"
          >
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row">
            <Typography
              variant="h5"
              color="#52c234" 
              p="10px"
              mt="5px"  
            >
             Daily Revenue      
            </Typography>
            <Typography
              variant="h5"
              
              p="10px"
              sx={{ mt: "5px" }}
            > 
               Kshs {dailyTotalPrice}
            </Typography>
            </Box>

            <Box 
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            >
            <Typography
              variant="h5"
              color="#52c234"
              p="10px"
              mt="5px"
            >
             Week Revenue  
            </Typography>
            <Typography
              variant="h5"
              p="10px"
              sx={{ mt: "5px" }}
            > 
              Kshs {weeklyTotalPrice}
            </Typography>
            </Box>

            <Box display="flex"
              justifyContent="space-between"
              alignItems="center"
              
                flexDirection="row"
             >
            <Typography
              variant="h5"
              color="#52c234"
              p="10px"
              mt="5px"  
            >
             Month Revenue  
            </Typography>
            <Typography
              variant="h6"
              p="10px"
              sx={{ mt: "5px" }}
            > 
              Kshs {monthlyTotalPrice}
            </Typography>
            </Box>
            
            <Box 
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
            >
            <Typography
              variant="h5"
              color="#52c234"
              p="10px"
              mt="5px"
            >
             Products Cost
            </Typography>
            <Typography
              variant="h6"
              p="10px"
              sx={{ mt: "5px" }}
            > 
               Kshs {totalBuyingPrice}
            </Typography>
            </Box>

            <Box 
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
            >
            <Typography
              variant="h5"
              color="#52c234"
              p="10px"
              mt="5px"
            >
              Gross Profit   
            </Typography>
            <Typography
              variant="h6"
              p="10px"
              sx={{ mt: "5px" }}
            > 
               Kshs {profit}
            </Typography>
            </Box>

            

          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#000000"
          sx={{ borderRadius: '5px', boxShadow: 4 }}
         
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "20px 20px 0 20px" }}
          >
            TOP PRODUCTS
          </Typography>
          <Box height="280px" 
               
                display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#000000"
          
            flexDirection="column"
          >
            <PieChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#000000"
          padding="20px"
          sx={{ borderRadius: '5px', boxShadow: 4 }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            GEOGRAPHY BASED TRAFFIC
          </Typography>
          <Box  backgroundColor="#000000" height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
