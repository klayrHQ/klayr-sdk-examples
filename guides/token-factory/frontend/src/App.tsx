import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material';
import { muiLightTheme } from './config/theme';
import { Header } from './layout/Header';

function App() {
  return (
    <ThemeProvider theme={muiLightTheme}>
      <div className="App">
        <Header/>
      </div>
    </ThemeProvider>
  );
}

export default App;
