import React, { useContext, useState } from "react";
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
import useAuth from "../auth/useAuth";

// import AccountBoxIcon from '@mui/icons-material/AccountBox';
import logo from "../../pics/logo.png";
import avatar from "../../pics/avatar.png";
import "./Navbar.css";

export default function Navbar() {
  const [showNavExternal, setShowNavExternal] = useState(false);
  const { authSession, handleLogout } = useAuth();

  return (
    <div>
      <MDBNavbar expand="lg" light className="navbar">
        <MDBContainer fluid>
          <MDBNavbarBrand href="/">
            <img src={logo} className="logo" alt="logo" />
            <span className="brand-name hide">
              {" "}
              <b>MIGR - AI - TION</b>{" "}
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
            {authSession ? (
              <>
                <img src={avatar} className="avatar" alt="avatar" />

                <MDBNavbarLink onClick={handleLogout}>Logout</MDBNavbarLink>
              </>
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
    </div>
  );
}
