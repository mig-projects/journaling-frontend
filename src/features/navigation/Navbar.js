import React, { useState } from "react";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useAuth } from "../../contexts/auth";

// import AccountBoxIcon from '@mui/icons-material/AccountBox';
import logo from "../../pics/logo_purple.png";
import "./Navbar.css";

export default function Navbar() {
  const [showNavExternal, setShowNavExternal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <MDBNavbar expand="lg" bgColor="white"
      sticky
      className="navbar">
      <MDBContainer fluid>
        <MDBNavbarBrand href="/">
          <img src={logo} className="logo" alt="logo" />
          <span className="brand-name hide">
            {" "}
            MIGR-AI-TION{" "}
          </span>
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowNavExternal(!showNavExternal)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse
          navbar
          show={showNavExternal}
          className="navbar-collapse"
        >
          {user ? (
            <MDBNavbarLink onClick={signOut} className="logout-button">
              <MDBIcon fas icon="user-circle" className="avatar" size="lg" />{" "}
              Logout
            </MDBNavbarLink>
          ) : (
            <MDBNavbarNav>
              <MDBNavbarLink href="/login" className="login-button">
                Login
              </MDBNavbarLink>
            </MDBNavbarNav>
          )}
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
