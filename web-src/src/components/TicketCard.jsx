import { Box, ButtonGroup, Typography } from "@mui/material";
import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const theme = createTheme({
    palette: {
      white: {
        main: '#fff',
        contrastText: '#000000',
      }
    }
  })

function TicketCard(props) {
    
    return ( 
        <React.Fragment>
            <Box sx={{ 
                minWidth: '15em', 
                maxWidth:'15em', 
                margin:'.5rem', 
                display:'inline-block',
                '@media (max-width: 899px)': {
                    display: 'none',
                },
            }}>
                <Card variant="outlined" sx={{
                    minHeight:'40vh',
                    minWidth:'5em',
                    margin:'0.5vw', 
                    borderColor:'#525863', 
                    color:'white', 
                    background:'#3f434a', 
                    boxShadow:'5px 5px 15px -4px rgba(0,0,0,0.47)',
                    position:'relative'
                }}>
                    <CardContent >
                        <Typography variant="h5" component="div" sx={{mb: 1.5, borderBottom:'1px solid #525863',}}>
                            {props.catagory}
                        </Typography>
                        <Typography>
                            User: {props.creatorEmail}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                            {
                            props.completed ? 
                                "Resolved"
                                :
                                "Unresolved"
                            }
                        </Typography>
                        <Typography variant="body2">
                            {props.summary.length > 255 ? 
                                <React.Fragment>
                                    {props.summary.substring(0, 251).concat("...")}
                                    <br/>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="outlined" color="white" size="small" sx={{mt:'3px'}}>Read More</Button>
                                    </ThemeProvider>
                                </React.Fragment>
                            : 
                                props.summary
                            }
                            
                        </Typography>
                    </CardContent>
                    <CardActions sx={{position:'absolute', bottom:'0px', mx:'15px', borderTop:'1px solid #525863', width:'100%'}}>
                        <ThemeProvider theme={theme}>
                            <ButtonGroup color="white" size="small" >
                                <Button variant="contained">Review</Button>
                                <Button >Comments</Button>
                            </ButtonGroup>
                        </ThemeProvider>
                    </CardActions>
                    
                </Card>
            </Box>

            <Box sx={{
                '@media (min-width: 900px)': {
                     display: 'none',
                },
                mb:'1em',
                mx:'.5em'
            }}>
            <Card variant="outlined" sx={{
                    minHeight:'26vh',
                    minWidth:'5em',
                    margin:'0.5vw', 
                    borderColor:'#525863', 
                    color:'white', 
                    background:'#3f434a', 
                    boxShadow:'5px 5px 15px -4px rgba(0,0,0,0.47)',
                    position:'relative'
                }}>
                    <CardContent sx={{height:'fit-content'}}>
                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                            {props.catagory}
                        </Typography>
                        <Typography>
                            User: {props.creatorEmail}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{mb: 1.5}}>
                            {
                            props.completed ? 
                                "Resolved"
                                :
                                "Unresolved"
                            }
                        </Typography>
                        <Typography variant="body2">
                            {props.summary.length > 128 ? props.summary.substring(0, 128).concat(" ...") : props.summary}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{position:'absolute', bottom:'0px'}}>
                        <ThemeProvider theme={theme}>
                            <ButtonGroup color="white" size="small" >
                                <Button variant="contained">Review</Button>
                                <Button >Comment</Button>
                            </ButtonGroup>
                        </ThemeProvider>
                    </CardActions>
                </Card>
            </Box>
        </React.Fragment>
        



    // <Box key={props.name} sx={{width:'100vw', height:'100vh'}}>
    //     {/* Large screen card */}
    //     <Box sx={{
    //         '@media (max-width: 899px)': {
    //             display: 'none',
    //         },
    //         display:'flex',
    //         background:'#000000',
    //         maxWidth: '30vw',
    //         minWidth:'30vw',
    //         minHeight: '40vh',
    //         ml:'10px',
    //         justifyContent:'center',
    //     }}>
    //         <Box sx={{width:'100%'}}>
    //             <Typography>
    //                 {props.name}
    //             </Typography>
    //         </Box>
            
    //         <Typography sx={{width:'100%'}}>
    //             {props.summary}
    //         </Typography>
    //     </Box>

    //     {/* Small screen card */}
    //     <Box sx={{
    //         '@media (min-width: 900px)': {
    //             display: 'none',
    //         },
    //     }}>
        
    //     tacos2

    //     </Box>
    // </Box> 
    );
}

export default TicketCard;