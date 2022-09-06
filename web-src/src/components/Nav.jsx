import * as React from "react";
import { Link } from "react-router-dom";

import { createTheme } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import BugIcon from '@mui/icons-material/PestControl';
import { ButtonGroup, ThemeProvider } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const theme = createTheme({
  palette: {
    white: {
      main: '#fff',
      contrastText: '#000000',
    }
  }
})

const pages = ["dashboard", "about"];
// const loggedOutSettings = ["Signup"];
const loggedInSettings = ["Logout", "User Info"]
function Navbar() {
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [signupDialogOpen, setSignupDialogOpen] = React.useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("")
  const [displayEmail, setDisplayEmail] = React.useState("")
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  const [sessionToken, setSessionToken] = React.useState(getCookie("session"))
  if (sessionToken !== "") {
    console.log(sessionToken)
    fetch('http://localhost:8080/login/info', {
        method: 'POST',
        headers: {
          ContentType: 'application/json'
        },
        body: JSON.stringify({
          token: sessionToken
        })
    }).then((res) => {
      if (res.status === 200){
        res.json()
      } else {
        console.log("token didnt work.")
      }
    }).then((data) => {
      console.log(data)
      // setDisplayEmail(data.email)
      setDisplayName(data.username)
      setUserLoggedIn(true)
    })
  }
  
  const handleSignup = (e) => {
    setUserLoggedIn(true)
  }

  const handleLogin = (e) => {
    if (email.length > 4 && password.length > 3) {
      fetch('http://localhost:8080/login/', {
        method: 'POST',
        headers: {
          ContentType: 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      }).then((res) => {
        if (res.status !== 200){
          console.log("wrong email/password combination")
          return
        } else if (res.status === 200) {
          setUserLoggedIn(true)
        }
      }).then(() => {
        let tk = getCookie("session")
        fetch('http://localhost:8080/login/info', {
        method: 'POST',
        headers: {
          ContentType: 'application/json'
        },
        body: JSON.stringify({
          token: tk,
        })
        }).then((res) => res.json())
        .then((data) => {
          setDisplayName(data.username)
        })
      })
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BugIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography variant="h6" noWrap component="a" href="/" sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            BUGTRACKER
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'monospace', fontWeight:300 }} textAlign="center" to={"/".concat(page)}>{page.toUpperCase()}</Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <BugIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BUGTRACKER
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {<Link to={"/".concat(page)} style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'monospace', fontWeight:100, fontSize:'1.1rem' }}>{page}</Link>}
              </Button>
            ))}
          </Box>

          
            {
            userLoggedIn ? 
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={ displayName.charAt(0).toUpperCase() } src="/" /> {/*TODO: Make this reflect the username*/}
                  </IconButton>
                </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {loggedInSettings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
              </Box>
              : // otherwise...
              <Box sx={{ flexGrow: 0 }}>
                <ThemeProvider theme={theme}>
                  <ButtonGroup>
                    <Button variant="contained" color="white" onClick={() => {setSignupDialogOpen(true)}}>Sign up</Button>
                    <Button variant="outlined" color="white" onClick={() => {setLoginDialogOpen(true)}}>Login</Button>
                  </ButtonGroup>
                </ThemeProvider>

                {/* Signup Dialog */}
                <Dialog open={signupDialogOpen} onClose={() => {setSignupDialogOpen(false)}}>
                  <DialogTitle>Create an Account</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To create an account, please enter an email, username and password.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="email" label="Email Address" type="email" fullWidth variant="standard" onChange={(e)=> {setEmail(e.target.value)}} />
                    <TextField autoFocus margin="dense" id="username" label="Username" fullWidth spellCheck={false} variant="standard" onChange={(e)=> {setUsername(e.target.value)}} />
                    <TextField autoFocus margin="dense" id="pass" label="Password" type="password" fullWidth variant="standard" onChange={(e)=> {setPassword(e.target.value)}} />
                  </DialogContent>
                  <DialogActions>
                    <ButtonGroup>
                      <Button variant="contained" onClick={handleSignup}>Signup</Button>
                      <Button onClick={() => {setSignupDialogOpen(false)}}>Cancel</Button>
                    </ButtonGroup>
                  </DialogActions>
                </Dialog>

                {/* Login Dialog */}
                <Dialog open={loginDialogOpen} onClose={() => {setLoginDialogOpen(false)}}>
                  <DialogTitle>Login</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To login, please enter your email and password.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="email" label="Email Address" type="email" fullWidth variant="standard" onChange={(e)=> {setEmail(e.target.value)}} />
                    <TextField autoFocus margin="dense" id="pass" label="Password" type="password" fullWidth variant="standard" onChange={(e)=> {setPassword(e.target.value)}} />
                  </DialogContent>
                  <DialogActions>
                    <ButtonGroup>
                      <Button variant="contained" onClick={handleLogin}>Login</Button>
                      <Button onClick={() => {setSignupDialogOpen(false)}}>Cancel</Button>
                    </ButtonGroup>
                  </DialogActions>
                </Dialog>
              </Box>
            }
            
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
