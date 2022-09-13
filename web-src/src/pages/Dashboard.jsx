import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TicketCard from '../components/TicketCard';

function Dashboard() {
  
  const hideOnSmall = {
    '@media (max-width: 700px)': {
      display: 'none',
    },
  }

  const tickets = [
    {
      ticket_id: 0,
      ticket_summary:"Tacos are good",
      ticket_submitted:"NOW",
      ticket_completed:true,
      ticket_catagory:"FOOD",
      ticket_creator_email:"tacos@tacos.com"
    },
    {
      ticket_id: 1,
      ticket_summary:"Tacos are bad",
      ticket_submitted:"NOW",
      ticket_completed:false,
      ticket_catagory:"FOOD",
      ticket_creator_email:"tacos@ta2cos.com"
    },
    {
      ticket_id: 2,
      ticket_summary:"Lettuce is bad",
      ticket_submitted:"YESTERDAY",
      ticket_completed:false,
      ticket_catagory:"VEGGIES",
      ticket_creator_email:"lettuce@lettuce.com"
    },
    {
      ticket_id: 3,
      ticket_summary:"When I go outside it is hot, when I go inside it is cold. I dunno what to do about this, it is a real connundrum that is unsolvable. The world should maintain a 70 degree temp at all times just for me because I am entitled and live in Florida where it is much to hot for anyone to live. The people that enjoy these temps should just go to hell because its about the same temperture there; they'd be comfortable.",
      ticket_submitted:"WHENEVER THE BIG BANG HAPPENED",
      ticket_completed:false,
      ticket_catagory:"WEATHER",
      ticket_creator_email:"itstoodamnhot@florida.com"
    },
    {
      ticket_id: 4,
      ticket_summary:"I love cheese",
      ticket_submitted:"BEFORE TIME",
      ticket_completed:true,
      ticket_catagory:"DAIRY",
      ticket_creator_email:"cheese@cheese.com"
    },
    {
      ticket_id: 5,
      ticket_summary:"Tacos are good",
      ticket_submitted:"NOW",
      ticket_completed:true,
      ticket_catagory:"FOOD",
      ticket_creator_email:"tacos@tacos.com"
    },
    {
      ticket_id: 6,
      ticket_summary:"Tacos are bad",
      ticket_submitted:"NOW",
      ticket_completed:false,
      ticket_catagory:"FOOD",
      ticket_creator_email:"tacos@ta2cos.com"
    },
    {
      ticket_id: 7,
      ticket_summary:"Lettuce is bad",
      ticket_submitted:"YESTERDAY",
      ticket_completed:false,
      ticket_catagory:"VEGGIES",
      ticket_creator_email:"lettuce@lettuce.com"
    },
    {
      ticket_id: 8,
      ticket_summary:"When I go outside it is hot, when I go inside it is cold. I dunno what to do about this, it is a real connundrum that is unsolvable. The world should maintain a 70 degree temp at all times just for me because I am entitled and live in Florida where it is much to hot for anyone to live. The people that enjoy these temps should just go to hell because its about the same temperture there; they'd be comfortable.",
      ticket_submitted:"WHENEVER THE BIG BANG HAPPENED",
      ticket_completed:false,
      ticket_catagory:"WEATHER",
      ticket_creator_email:"itstoodamnhot@florida.com"
    },
    {
      ticket_id: 9,
      ticket_summary:"I love cheese",
      ticket_submitted:"BEFORE TIME",
      ticket_completed:true,
      ticket_catagory:"DAIRY",
      ticket_creator_email:"cheese@cheese.com"
    },
  ]

  return (
    <Box sx={{ overflow:'hidden', mt:'.5em' }}>
      {
        tickets.map((ticket) => {
          return (
          <TicketCard 
            key={ticket.ticket_id} 
            ticketID={ticket.ticket_id} 
            catagory={ticket.ticket_catagory} 
            summary={ticket.ticket_summary}
            completed={ticket.ticket_completed}
            submitted={ticket.ticket_submitted}
            creatorEmail={ticket.ticket_creator_email}
          />
          )
      
      })
      }
    </Box>
    
  );
}

export default Dashboard;