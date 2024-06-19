import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import CRUDTable from './context/CrudEjemplo';
import { Navbar, Footer, Sidebar, ThemeSettings, LineChart } from './components';


import { useStateContext } from './context/ContextProvider';

import './App.css';
import CRUDDonador from './context/CrudDonador';
import CRUDProyecto from './context/CrudProyectos';
import CRUDAyudante from './context/CrudAyudante';


const App = () => {
  const { activeMenu } = useStateContext();
  
  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <BrowserRouter>

        {activeMenu ? (
          <div className="w-[5%] fixed sidebar dark:bg-secondary-dark-bg bg-white transition-all duration-300">
            <Sidebar />
          </div>
        ) : (
          <div className="w-20 fixed sidebar dark:bg-secondary-dark-bg bg-white transition-all duration-300">
            <Sidebar />
          </div>
        )}

        <div className={`dark:bg-main-bg bg-main-bg min-h-screen w-full transition-all duration-300 ${activeMenu ? 'md:ml-[15%]' : 'md:ml-20'}`}>
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          
          <div className="p-4">
            <Routes>
              {/* Dashboard */}
              <Route path="/" />

              {/* Tables */}
              <Route path="/donaciones" />
              <Route path="/donadores" element={<CRUDDonador />} />
              <Route path="/beneficiarios" element={<CRUDTable />} />
              <Route path="/ayudantes" element={<CRUDAyudante/>}/>
              <Route path="/proyectos" element={<CRUDProyecto />} />
             
  

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
