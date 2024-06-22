import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import CRUDTable from './pages/CrudEjemplo';
import { Navbar, Footer, Sidebar, ThemeSettings, LineChart } from './components';

import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, BarElement, Title } from 'chart.js';


import { ProjectProvider } from './context/ProyectosContext';
import { BeneficiarioProvider } from './context/BeneficiariosContext';
import { DonadorProvider } from './context/DonadoresContext';
import { DonacionesProvider } from './context/DonacionesContext';
import { InsumoProvider } from './context/InsumosContext';

import { useStateContext } from './context/ContextProvider';

import './App.css';
import DDashboard from './pages/dashboard';
import Dashboard from './pages/dashboard'; // Importar el componente Dashboard aquí
import CRUDDonador from './pages/CrudDonador';
import CRUDProyecto from './pages/CrudProyectos';
import CRUDDonacion from './pages/CrudDonacion';
import CRUDInsumos from './pages/CrudInsumo';
import { GrDashboard } from 'react-icons/gr';
import { DarkModeProvider } from './context/DarkModeContext';

const App = () => {
  const { activeMenu } = useStateContext();

  return (
    <DarkModeProvider>
      <div className="flex relative dark:bg-main-dark-bg">
        <BrowserRouter>
          <ProjectProvider>
            <BeneficiarioProvider>
              <DonadorProvider>
                <DonacionesProvider>
                  <InsumoProvider>
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
                          <Route path="/dashboard" element={<Dashboard />} /> {/* Ruta para Dashboard */}

                          {/* Demás rutas */}
                          <Route path="/donaciones" element={<CRUDDonacion />} />
                          <Route path="/donadores" element={<CRUDDonador />} />
                          <Route path="/beneficiarios" element={<CRUDTable />} />
                          <Route path="/proyectos" element={<CRUDProyecto />} />
                          <Route path="/insumos" element={<CRUDInsumos />} />
                          <Route path="/ayudantes" />

                          {/* Ejemplo de gráfico */}
                          <Route path="/line-chart" element={<LineChart />} />
                        </Routes>
                      </div>
                    </div>
                  </InsumoProvider>
                </DonacionesProvider>
              </DonadorProvider>
            </BeneficiarioProvider>
          </ProjectProvider>
        </BrowserRouter>
      </div>
    </DarkModeProvider>
  );
};

export default App;
