import { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  Button,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { Link } from 'react-router';
import PageHeader from '../../components/PageHeader';

const faqs = [
  {
    question: "What is your return policy?",
    answer: "You can return any item within 30 days of purchase. Please keep the receipt.",
  },
  {
    question: "How can I create a property?",
    answer: "You can create a property by clicking on the 'Create Property' button in the home page.",
  },
  {
    question: "Can I purchase items as a gift?",
    answer: "Yes, simply enter the recipient's details at checkout.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we offer international shipping to selected countries.",
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="md">
      <PageHeader
        eyebrow="Help"
        title="Frequently Asked Questions"
        subtitle="Quick answers to the things people ask us most."
      />
      <Box>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              transition: 'border-color 0.2s ease',
              '&.Mui-expanded': { borderColor: 'primary.main' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
              sx={{ px: 3, py: 0.5 }}
            >
              <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Card sx={{ mt: 5, p: { xs: 3, sm: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Still have questions?</Typography>
            <Typography variant="body2" color="text.secondary">
              Learn more about what the booking system can do.
            </Typography>
          </Box>
          <Button component={Link} nativeButton={false} to="/about" variant="outlined" startIcon={<InfoIcon />}>
            About the app
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};

export default FAQ;
