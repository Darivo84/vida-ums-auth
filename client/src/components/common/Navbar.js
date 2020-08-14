import React from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar">
        <img
          src="https://i.imgur.com/puT45y7.png"
          className="logo"
          alt="Vida Logo"
        />
        <Typography className="logoTypography" component="h1" variant="h5">
          Vida Customer Portal
        </Typography>
      </nav>
    );
  }
}

export default withRouter(Navbar);
