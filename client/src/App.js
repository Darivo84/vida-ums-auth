import React from 'react';
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../src/components/theme/theme";
import Navbar from './components/common/Navbar';
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup";
import Reset from "./components/pages/Reset"
import PasswordReset from './components/pages/PasswordReset'
import Dashboard from "./components/pages/Dashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/reset-password">
          <Reset />
        </Route>
        <Route path="/reset-password/:token">
          <PasswordReset />
        </Route>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
