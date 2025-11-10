import logo from "../../resources/USDA_logo.png";
import {Stack, TextField, Autocomplete} from '@mui/material';
import { styled } from '@mui/material/styles';
import colors from "../../resources/colors.js"
import React from 'react';
import './NavBar.css';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },{
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },];

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

        <Autocomplete sx={{width: "100%"}} size="small" options={top100Films}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="search"
          />
        )}/>
        <p/>
      </NavFill>
    </div>
  );
}
