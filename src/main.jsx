import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./assets/styles/global.css";
import Providers from "./app/providers";

createRoot(document.getElementById('root')).render(
  <Providers>
    <App />
  </Providers>
)
