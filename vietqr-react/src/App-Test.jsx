import React from 'react';
import { ThemeProvider } from './styles/ThemeProvider';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  console.log('App component rendering...');
  
  return (
    <ThemeProvider>
      <GlobalStyles />
      <div style={{ 
        padding: '40px',
        minHeight: '100vh',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ marginBottom: '20px' }}>🎉 VietQR - HD SAISON</h1>
        <p style={{ marginBottom: '10px' }}>✅ React is working!</p>
        <p style={{ marginBottom: '10px' }}>✅ ThemeProvider is working!</p>
        <p style={{ marginBottom: '10px' }}>✅ Styled-components is working!</p>
        
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          background: '#f0f0f0',
          borderRadius: '8px'
        }}>
          <h2>Next Steps:</h2>
          <ol>
            <li>Add contexts providers</li>
            <li>Add layout components</li>
            <li>Add feature tabs</li>
          </ol>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
