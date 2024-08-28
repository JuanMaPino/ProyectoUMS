import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Sidebar } from './components';

import { ProyectoProvider } from './context/ProyectosContext';
import { BeneficiarioProvider } from './context/BeneficiariosContext';
import { DonadorProvider } from './context/DonadoresContext';
import { DonacionesProvider } from './context/DonacionesContext';
import { InsumoProvider } from './context/InsumosContext';

import { RolProvider } from './context/RolesContext';
import { AuthProvider } from './context/AuthContext';

import { useStateContext } from './context/ContextProvider';
import ProtectedRoute from './components/ProtectedRoutes';

import './App.css';
import Register from './pages/Register';
import CRUDTable from './pages/CrudEjemplo';
import Dashboard from './pages/dashboard';
import CRUDDonador from './pages/CrudDonador';
import CRUDProyecto from './pages/CrudProyectos';
import CRUDAyudante from './pages/CrudAyudante';
import CRUDDonacion from './pages/CrudDonacion';
import CRUDInsumos from './pages/CrudInsumo';
import CRUDTarea from './pages/CrudTarea';
import CRUDActividad from './pages/CrudActividad';


import { GrDashboard } from 'react-icons/gr';

import CRUDRoles from './pages/CrudRol';

import Login from './pages/Login';

import { DarkModeProvider } from './context/DarkModeContext';
import { AyudanteProvider } from './context/AyudantesContext';
import { TareaProvider } from './context/TareasContext';

const AppLayout = ({ children }) => {
  const { activeMenu } = useStateContext();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {!isAuthPage && (
        <>
          {activeMenu ? (
            <div className="w-[5%] fixed sidebar dark:bg-secondary-dark-bg bg-white transition-all duration-300">
              <Sidebar />
            </div>
          ) : (
            <div className="w-20 fixed sidebar dark:bg-secondary-dark-bg bg-white transition-all duration-300">
              <Sidebar />
            </div>
          )}
        </>
      )}

      <div className={`w-full ${!isAuthPage && activeMenu ? 'md:ml-[15%]' : 'md:ml-0'}`}>
        {!isAuthPage && (
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
        )}

        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <DarkModeProvider>

      <div className="flex relative dark:bg-main-dark-bg">
        <BrowserRouter>

      <BrowserRouter>
        <AuthProvider>
            <ProyectoProvider>
              <BeneficiarioProvider>
                <DonadorProvider>
                  <DonacionesProvider>
                    <InsumoProvider>
                      <AyudanteProvider>
                        <TareaProvider>
                          <RolProvider>
                            <AppLayout>
                              <Routes>
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/" element={<Navigate to="/login" />} />
                                <Route path="/donaciones" element={<CRUDDonacion />} />
                                <Route path="/donadores" element={<CRUDDonador />} />
                                <Route path="/beneficiarios" element={<CRUDTable />} />
                                <Route path="/proyectos" element={<CRUDProyecto />} />

                                <Route path="/roles" element={<CRUDRoles />} />

                                <Route path="/insumos" element={<CRUDInsumos />} />
                                <Route path="/ayudantes" element={<CRUDAyudante />} />
                                <Route path="/tareas" element={<CRUDTarea />} />
                                <Route path="/actividades" element={<CRUDActividad />} />

                                

                                {/* Ejemplo de gráfico */}
                                <Route path="/line-chart" element={<LineChart />} />

                              </Routes>
                            </AppLayout>
                          </RolProvider>
                        </TareaProvider>
                      </AyudanteProvider>
                    </InsumoProvider>
                  </DonacionesProvider>
                </DonadorProvider>
              </BeneficiarioProvider>
            </ProyectoProvider>
        </BrowserRouter>
      </div>

          
        </AuthProvider>
      </BrowserRouter>
    </DarkModeProvider>
  );
};

export default App;
