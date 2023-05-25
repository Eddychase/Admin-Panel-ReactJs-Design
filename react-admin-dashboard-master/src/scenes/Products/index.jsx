import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";


const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);

  const columns = [
     // Updated field name to match the transaction data
    {
      field: "name", // Updated field name to match the transaction data
      headerName: "Name",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "buyingPrice",
      headerName: "Price Bought",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[300]}>
          Kshs {params.row.buyingPrice} {/* Updated field name to match the transaction data */}
        </Typography>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "minSellingPrice", // Updated field name to match the transaction data
      headerName: "min Selling Price",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[300]}>
          Kshs {params.row.minSellingPrice} {/* Updated field name to match the transaction data */}
        </Typography>
      ),
    },
    {
      field: "delete",
      headerName: "",
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
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://mobried-admin-panel.onrender.com/api/products");
        const formattedProducts = response.data.map((product) => ({
          ...product,
          id: product._id, // Assign the product's _id to the id field
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://mobried-admin-panel.onrender.com/api/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
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
        <DataGrid rows={products} columns={columns}
        components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Products;
