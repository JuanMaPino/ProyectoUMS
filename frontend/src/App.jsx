import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import CRUDTable from './components/CrudEjemplo';
import { Navbar, Footer, Sidebar, ThemeSettings, LineChart } from './components';
import { Donadores, Donaciones, Ayudantes, Beneficiarios, Dashboard, Proyectos } from './pages';

import { useStateContext } from './context/ContextProvider';

import './App.css';
import CRUDDonador from './components/CrudDonador';
import CRUDProyecto from './components/CrudProyectos';


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
              <Route path="/" element={<Dashboard />} />

              {/* Tables */}
              <Route path="/donaciones" element={<Donaciones />} />
              <Route path="/donadores" element={<CRUDDonador />} />
              <Route path="/beneficiarios" element={<CRUDTable />} />
              <Route path="/ayudantes" element={<Ayudantes />} />
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
