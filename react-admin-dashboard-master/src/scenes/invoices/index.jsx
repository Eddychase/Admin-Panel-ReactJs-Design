import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactions, setTransactions] = useState([]);


  

  const columns = [
     // Updated field name to match the transaction data
    {
      field: "productName", // Updated field name to match the transaction data
      headerName: "Product",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "sellingPrice", // Updated field name to match the transaction data
      headerName: "Price",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.sellingPrice} {/* Updated field name to match the transaction data */}
        </Typography>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.quantity * params.row.sellingPrice} {/* Updated field name to match the transaction data */}
        </Typography>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        Delete
      </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/transactions");
        const formattedTransactions = response.data.map((transaction) => ({
          id: transaction._id,
          ...transaction,
        }));
        setTransactions(formattedTransactions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/transactions/${id}`);
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={transactions} columns={columns}
        components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Invoices;
