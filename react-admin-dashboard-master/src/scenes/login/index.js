import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const {  dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("https://mobried-admin-panel.onrender.com/api/auth/login", credentials);
      if (res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

        navigate("/");
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You are not allowed!" },
        });
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <Box>
      <Typography display="flex" justifyContent="center" alignItems="center"  variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" >
      <form onSubmit={handleClick}>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          onChange={handleChange}
        />
        <Box display="flex" justifyContent="center" alignItems="center">
        <Button  type="submit" variant="contained" color="primary" size="large">
          Login
        </Button>
        </Box>
      </form>
      </Box>
    </Box>
  );
};

export default Login;
