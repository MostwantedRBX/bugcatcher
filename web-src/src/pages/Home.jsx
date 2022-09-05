import BugIcon from '@mui/icons-material/PestControl';
import {  Typography } from '@mui/material/';

function Home() {
    return(
        
            <header className="App-Container">
                <Typography>
                    <BugIcon sx={{fontSize:"80px"}}/>
                    <h1>Bugtracker</h1>
                    <Typography sx={{marginLeft:"20%", marginRight:"20%"}}>
                        Welcome to my app for bugtracking!<br/>
                        To get started create an account with the signup button in the top right, 
                        and then navigate to the dashboard using the navbar.
                    </Typography>
                </Typography>
            </header>
        
    )
}

export default Home