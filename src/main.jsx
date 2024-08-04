import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeToggleProvider } from './ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeToggleProvider>
      <App />
    </ThemeToggleProvider>
  </React.StrictMode>
);


// first I create the theme provider for light and dark mode, along with responsive font sizes for mobile devices
// Then I create the login and signup pages.
// Then I create the emailConfirmSuccess and emailConfirmFail pages.

// after all this, I immdiatly implement google and apple sign in.
