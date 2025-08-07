import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.warn('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevents the unhandled rejection from being logged to console as an error
});

createRoot(document.getElementById("root")!).render(<App />);
