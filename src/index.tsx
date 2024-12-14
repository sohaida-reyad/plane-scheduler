import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './css/index.css';
import { PlaneScheduler } from './components/PlaneScheduler';
import { Simulator } from './components/DataSimulator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApproxScheduler } from './components/ApproxScheduler';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="scheduler" element={<PlaneScheduler />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="approx-scheduler" element={<ApproxScheduler />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Simulator />
//   </React.StrictMode>
// );
