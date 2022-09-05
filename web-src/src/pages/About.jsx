import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function About() {
    return ( 
        <header>
            <Typography variant="h2" sx={{mt:'2rem', fontWeight:600}}>
                ABOUT
            </Typography>
                <header className="about-content">
                    <Typography>
                        <Typography sx={{marginLeft:"20%", marginRight:"20%"}}>
                            <Typography variant="h4" sx={{borderBottom:'2px solid rgba(255, 255, 255, 0.1)', mb:'.4rem'}}> Hello, my name is Jereb Gainer! </Typography>
                            <Typography>
                                I've created this project both as practice and in order to show what I've learned over the time I practiced.
                                Over the past few years I've learned a ton involving web development. I've tinkered and tinkered with different
                                technologies and I'll list a few that this project uses: <br/><br/>
                                Golang • React • MaterialUI • Posgresql • Docker<br/><br/>
                                Here are links for my:<br/>
                                <ButtonGroup variant="contained" sx={{mt:'.4rem'}}>
                                    <Button target="_blank" href="https://github.com/MostwantedRBX" startIcon={<GitHubIcon />}>Github</Button>
                                    <Button target="_blank" href="https://www.linkedin.com/in/jereb-gainer-450017218"startIcon={<LinkedInIcon />}>Linkedin</Button>
                                    <Button target="_blank" href="https://docs.google.com/document/d/1vZQcK5Zvr5g4LGTvOa3OPA2ixk9VqJCjC7pO5u_f1yY/edit?usp=sharing"startIcon={<GoogleIcon />}>Resume</Button> 
                                </ButtonGroup>
                            </Typography>
                        </Typography>
                    </Typography>
                </header>
        </header>
    );
}

export default About;