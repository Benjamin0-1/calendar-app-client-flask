import React, { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ToastContainer } from 'react-toastify';

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
      <Typography variant="h4" align="center" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box my={4}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <ToastContainer autoClose={1500} />
    </Container>
  );
};

export default FAQ;
