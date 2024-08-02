import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { auth } from "./utils/firebaseConfig";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Room from "./pages/Room";

import LogoutIcon from "@mui/icons-material/Logout";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error during logout: ", error);
      });
  };
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Chat Room
            </Typography>
            <Box display={auth.currentUser ? "flex" : "none"} gap={3}>
              <Button
                color="inherit"
                onClick={() => alert("Chatbot is not implemented yet.")}
                startIcon={<SmartToyIcon />}
              >
                Chatbot
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="*" element={<Navigate to="/signin" replace />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
