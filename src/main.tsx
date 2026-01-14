import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ColourFinder from './ColourFinder';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColourFinder />
  </StrictMode>,
)
