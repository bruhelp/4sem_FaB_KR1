import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    // Строгий режим — инструмент для обнаружения потенциальных проблем
    <React.StrictMode> 
        <App/>
    </React.StrictMode>
)   