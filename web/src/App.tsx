import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import ResponsiveModal from './Component/ResponsiveModal/ResponsiveModal';
import Routing from './Routing';

function App() {
  return (
    <>
      <Routing />
      <ResponsiveModal></ResponsiveModal>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
