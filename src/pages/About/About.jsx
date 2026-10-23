import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import ApartmentIcon from '@mui/icons-material/ApartmentOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsActiveOutlined';
import InsightsIcon from '@mui/icons-material/InsightsOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddHomeIcon from '@mui/icons-material/AddHomeOutlined';
import EventIcon from '@mui/icons-material/EventAvailableOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const features = [
  {
    title: 'Simplified Property Management',
    description:
      'Easily manage multiple properties with our intuitive system. Track bookings, availability, and customer details all in one place.',
    icon: <ApartmentIcon />,
  },
  {
    title: 'Real-Time Booking Updates',
    description:
      'Stay up-to-date with real-time booking information. Our app ensures that you are always aware of your property\'s status.',
    icon: <BoltIcon />,
  },
  {
    title: 'Automated Notifications',
    description:
      'Receive instant notifications for new bookings, cancellations, and important reminders, ensuring you never miss a detail.',
    icon: <NotificationsIcon />,
  },
  {
    title: 'Comprehensive Reporting',
    description:
      'Generate detailed reports on your property\'s performance, including booking trends, revenue, and customer feedback.',
    icon: <InsightsIcon />,
  },
];

const steps = [
  { title: 'Add your properties', description: 'Create an entry for every venue or rental you manage.', icon: <AddHomeIcon /> },
  { title: 'Book dates', description: 'Reserve days for customers and edit them as plans change.', icon: <EventIcon /> },
  { title: 'Stay on top of it', description: 'See every booking across every property from one dashboard.', icon: <DoneAllIcon /> },
];

// Example bookings for the hero illustration.
const previewBookings = [
  { day: '12', month: 'NOV', customer: 'Garcia wedding', property: 'Lakeside Hall' },
  { day: '15', month: 'NOV', customer: 'Acme offsite', property: 'Rooftop Loft' },
  { day: '21', month: 'NOV', customer: 'Birthday party', property: 'Garden Pavilion' },
];

const IconTile = ({ children, color = 'primary' }) => (
  <Avatar
    variant="rounded"
    sx={(theme) => ({
      width: 48,
      height: 48,
      borderRadius: 3,
      bgcolor: alpha(theme.palette[color].main, 0.12),
      color: `${color}.main`,
    })}
  >
    {children}
  </Avatar>
);

const HeroPreview = () => (
  <Card
    sx={(theme) => ({
      p: 2.5,
      boxShadow: `0 30px 60px -20px ${alpha(theme.palette.primary.main, 0.35)}`,
      transform: { md: 'rotate(1.5deg)' },
    })}
  >
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Upcoming bookings</Typography>
      <Chip size="small" color="success" variant="outlined" label="3 this month" />
    </Stack>
    <Stack spacing={1.5}>
      {previewBookings.map((booking) => (
        <Stack
          key={booking.customer}
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', p: 1.5, borderRadius: 3, border: 1, borderColor: 'divider' }}
        >
          <Box sx={{ width: 48, textAlign: 'center', borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 10, fontWeight: 700, py: 0.25 }}>
              {booking.month}
            </Box>
            <Typography sx={{ fontWeight: 700, py: 0.25 }}>{booking.day}</Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{booking.customer}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">{booking.property}</Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  </Card>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: { xs: -3, md: -5 } }}>
      {/* Hero */}
      <Box
        sx={(theme) => ({
          py: { xs: 6, md: 10 },
          background: `radial-gradient(ellipse 80% 60% at 70% 0%, ${alpha(theme.palette.primary.main, 0.14)}, transparent),
                       radial-gradient(ellipse 60% 50% at 0% 100%, ${alpha(theme.palette.secondary.main, 0.1)}, transparent)`,
        })}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 6, md: 8 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip label="Multi-Property Booking System" color="primary" variant="outlined" sx={{ mb: 3 }} />
              <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, lineHeight: 1.1 }}>
                Every booking, for every property,{' '}
                <Box
                  component="span"
                  sx={(theme) => ({
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  })}
                >
                  in one place.
                </Box>
              </Typography>
              <Typography variant="h6" component="p" color="text.secondary" sx={{ mt: 3, fontWeight: 400, lineHeight: 1.6, maxWidth: 600 }}>
                Imagine you have many properties you need to manage, and you rent them on a daily basis. For instance, your properties might be venues for parties or events, rented only for one day at a time. Instead of juggling all of this manually on your phone’s calendar, our app provides a seamless and efficient solution for managing bookings across multiple properties.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
                <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/signup')}>
                  Sign Up Now
                </Button>
                <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/login')} sx={{ borderColor: 'divider' }}>
                  I already have an account
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <HeroPreview />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="primary">Features</Typography>
          <Typography variant="h4" component="h2">Key Features</Typography>
        </Box>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid size={{ xs: 12, sm: 6 }} key={feature.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3.5, '&:last-child': { pb: 3.5 } }}>
                  <IconTile>{feature.icon}</IconTile>
                  <Typography variant="h6" component="h3" sx={{ mt: 2.5, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderBottom: 1, borderColor: 'divider', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6, maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" color="primary">How it works</Typography>
            <Typography variant="h4" component="h2" gutterBottom>How Our App Works</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Our Multi-Property Booking System allows you to manage all your properties from a single platform. You can easily view availability, book dates, track customer information, and even receive automated notifications for each booking. Whether you’re managing a few properties or a large portfolio, our app is designed to simplify your workflow and increase your productivity.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.title}>
                <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ position: 'relative' }}>
                    <IconTile color="secondary">{step.icon}</IconTile>
                    <Avatar
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 22,
                        height: 22,
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </Box>
                  <Typography variant="h6" component="h3">{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>{step.description}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to action */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={(theme) => ({
            textAlign: 'center',
            borderRadius: 6,
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 7 },
            color: '#fff',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          })}
        >
          <Typography variant="h4" component="h2">Ready to simplify your bookings?</Typography>
          <Typography sx={{ mt: 1.5, opacity: 0.85 }}>Create a free account and add your first property in under a minute.</Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ mt: 4, bgcolor: '#fff', color: 'primary.dark', '&:hover': { bgcolor: alpha('#fff', 0.9) } }}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
