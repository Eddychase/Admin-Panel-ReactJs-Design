import { Box, Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { transactionInputs } from "../../formSource";
import { useNavigate } from "react-router-dom";

const TransactionForm = () => {
    const [productList, setProductList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [transactionData, setTransactionData] = useState({});
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("https://mobried-admin-panel.onrender.com/api/products");
          setProductList(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchProducts();
    }, []);
  
    const handleProductChange = (e) => {
      setSelectedProduct(e.target.value);
    };
  
    const handleTransactionDataChange = (e) => {
      setTransactionData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const newTransaction = {
          ...transactionData,
          productId: selectedProduct,
        };
        await axios.post(
          "https://mobried-admin-panel.onrender.com/api/transactions",
          newTransaction
        );
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    };
  

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New Transaction" />
      <FormControl>
  <InputLabel>Select a Product</InputLabel>
  <Select style={{ width: '300px', border: '1px solid white', color:"#093637" }} value={selectedProduct} onChange={handleProductChange}>
    <MenuItem value="">
      <em>-- Select a product --</em>
    </MenuItem>
    {productList.map((product) => (
      <MenuItem key={product._id} value={product._id}>
        {product.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

      <form onSubmit={handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          marginTop="20px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {transactionInputs.map((input) => (
  <TextField
    key={input.id}
    fullWidth
    variant="filled"
    type={input.type}
    label={input.label}
    onChange={handleTransactionDataChange}
    name={input.id}
    sx={{ gridColumn: input.gridColumn }}
  />
))}

        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Create New Transaction
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TransactionForm;
