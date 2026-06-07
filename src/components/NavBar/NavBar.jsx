import logo from "../../resources/USDA_logo.png";
import {Stack, Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import colors from "../../resources/colors.js"
import React from 'react';
import './NavBar.css';

const NavFill = styled(Stack)(({ theme }) => ({
  backgroundColor: colors.offWhite,
  padding: theme.spacing(2),
  textAlign:'center',
  border: '4px solid',
  borderColor: '#000000',
  borderRadius: 50

}))

export default function NavBar() {
  return (
    <div className = "nav">
      <NavFill direction = "row" spacing = {1} minWidth="550px">
        <p/>
        <img style = {{paddingTop:5}} src={logo} width={38} height={30} alt="USDA"/>
        <h1 style = {{paddingLeft:4, minWidth: "340px"}} className= "title">CROP ROTATION TOOL</h1>
        <h1 className = "montserrat-regular">@</h1>

        <Box style = {{width:"100%"}} id="search-container"></Box>

        <p/>
      </NavFill>
    </div>
  );
}
