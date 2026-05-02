import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';
import './index.css';

console.log('App.jsx loaded');

const App = () => {
  console.log('App component rendering');
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRouter />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;