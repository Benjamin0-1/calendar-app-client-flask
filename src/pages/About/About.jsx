import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Simplified Property Management',
    description:
      'Easily manage multiple properties with our intuitive system. Track bookings, availability, and customer details all in one place.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUMR3AvLjerU-dWXt_xLFxn56NyXm8nioV5Q&s',
  },
  {
    title: 'Real-Time Booking Updates',
    description:
      'Stay up-to-date with real-time booking information. Our app ensures that you are always aware of your property\'s status.',
    image: 'https://wealthmasteryacademy.com/wp-content/uploads/2016/12/Basic-Property-Knowledge.jpg',
  },
  {
    title: 'Automated Notifications',
    description:
      'Receive instant notifications for new bookings, cancellations, and important reminders, ensuring you never miss a detail.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpl2vhwD3dIMIMsGKm18zGbWLhnaBnB8sWVQ&s',
  },
  {
    title: 'Comprehensive Reporting',
    description:
      'Generate detailed reports on your property\'s performance, including booking trends, revenue, and customer feedback.',
    image: 'https://agentrealestateschools.com/wp-content/uploads/2021/11/real-estate-property.jpg',
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box my={4} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Welcome to the Multi-Property Booking System
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Imagine you have many properties you need to manage, and you rent them on a daily basis. For instance, your properties might be venues for parties or events, rented only for one day at a time. Instead of juggling all of this manually on your phone’s calendar, our app provides a seamless and efficient solution for managing bookings across multiple properties.
        </Typography>
      </Box>

      <Box my={6}>
        <Typography variant="h4" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 160 }}
                  image={feature.image}
                  alt={feature.title}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h5">{feature.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box my={6} textAlign="center">
        <Typography variant="h4" gutterBottom>
          How Our App Works
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Our Multi-Property Booking System allows you to manage all your properties from a single platform. You can easily view availability, book dates, track customer information, and even receive automated notifications for each booking. Whether you’re managing a few properties or a large portfolio, our app is designed to simplify your workflow and increase your productivity.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4 }}
          onClick={() => navigate('/signup')}
        >
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default About;
