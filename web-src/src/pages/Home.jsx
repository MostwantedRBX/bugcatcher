import BugIcon from '@mui/icons-material/PestControl';
import {  Typography } from '@mui/material/';

function Home() {
    return(
        
            <header className="App-Container">
                <BugIcon sx={{fontSize:"80px"}}/>
                
                <Typography variant='h2' sx={{fontWeight:600, mb:'1rem'}}>BUGTRACKER</Typography>
                <Typography sx={{marginLeft:"20%", marginRight:"20%"}}>
                    Welcome to my app for bugtracking!<br/>
                    To get started create an account with the signup button in the top right, <br />
                    and then navigate to the dashboard using the navbar.
                </Typography>
            </header>
        
    )
}

export default Home