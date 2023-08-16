import React, { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarLink,
    MDBIcon,
    MDBCollapse
} from 'mdb-react-ui-kit';

// import AccountBoxIcon from '@mui/icons-material/AccountBox';
import logo from "../../pics/logo.png"
import './Navbar.css';


export default function Navbar() {
    const [showNavExternal, setShowNavExternal] = useState(false);

    var styles1 = {
        width: '35px',
        marginLeft: '10px',
    }

    var styles2 = {
        fontSize: '24px',
        padding: '10px',

    }

    var styles3 = {
        boxShadow: 'none',
    }

    return (
        <div>
            <MDBNavbar expand='lg' light style={styles3} >
                <MDBContainer fluid>
                    <MDBNavbarBrand href='/'>
                        <img src={logo} style={styles1} alt="logo" />
                        <span style={styles2} className="hide"> <b>MIGR - AI - TION</b> </span>
                    </MDBNavbarBrand>

                    <MDBNavbarToggler
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setShowNavExternal(!showNavExternal)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>

                    <MDBCollapse navbar show={showNavExternal}>
                        <MDBNavbarNav>
                            <MDBNavbarLink href='/login'>Login</MDBNavbarLink>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>



        </div>
    );
}