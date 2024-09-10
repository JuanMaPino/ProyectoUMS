import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Sidebar } from './components';

import { ProyectoProvider } from './context/ProyectosContext';
import { BeneficiarioProvider } from './context/BeneficiariosContext';
import { DonadorProvider } from './context/DonadoresContext';
import { DonacionesProvider } from './context/DonacionesContext';
import { InsumoProvider } from './context/InsumosContext';
import { AuthProvider } from './context/AuthContext';
import { useStateContext } from './context/ContextProvider';
import { RolProvider } from './context/RolesContext';
import ProtectedRoute from './components/ProtectedRoutes';

import './App.css';
import CRUDRoles from './pages/CrudRol';
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
import LineChart from './components/Charts/LineChart';

import Activities from './pages/Activities';
import Login from './pages/Login';
import ResetPassword from './pages/RecuperarContraseña';
import { DarkModeProvider } from './context/DarkModeContext';
import { AyudanteProvider } from './context/AyudantesContext';
import { TareaProvider } from './context/TareasContext';
import { ActividadProvider } from './context/ActividadContext';

const AppLayout = ({ children }) => {
  const { activeMenu } = useStateContext();
  const location = useLocation();

  // Incluir '/olvide-' en la verificación de páginas de autenticación
  const isAuthPage = ['/login', '/register', '/olvide-contrasena'].includes(location.pathname);

  console.log("Current Path:", location.pathname); // Depuración
  console.log("Is Auth Page:", isAuthPage); // Depuración

  return (
    <div className="flex relative dark:bg-main-dark-bg h-screen">
      {!isAuthPage && (
        <>
          {activeMenu ? (
            <div className="w-[5%] fixed sidebar dark:bg-secondary-dark-bg bg-white transition-all duration-300">
              <Sidebar />
            </div>
          ) : (
            <div className="w-20 fixed sidebar dark:bg-secondary-dark-bg  bg-white transition-all duration-300">
              <Sidebar />
            </div>
          )}
        </>
      )}

      <div className={`w-full ${!isAuthPage && activeMenu ? 'md:ml-[16%]':  'md:ml-auto'} overflow-auto`}>
        {!isAuthPage && (
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
        )}

        <div className="min-h-[100vh] h-full overflow-y-auto ">
          {children}
        </div>
      </div>
    </div>
  );
};



const App = () => {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ActividadProvider>
            <ProyectoProvider>
              <BeneficiarioProvider>
                <DonadorProvider>
                  <DonacionesProvider>
                    <InsumoProvider>
                      <AyudanteProvider>
                        <RolProvider>
                          <TareaProvider>
                            <AppLayout>
                              <Routes>
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/olvide-contrasena" element={<ResetPassword/>}/>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/" element={<Navigate to="/login" />} />
                                {/*<Route element={<ProtectedRoute/>}> */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/roles" element={<CRUDRoles />} />
                                <Route path="/donaciones" element={<CRUDDonacion />} />
                                <Route path="/donadores" element={<CRUDDonador />} />
                                <Route path="/beneficiarios" element={<CRUDTable />} />
                                <Route path="/proyectos" element={<CRUDProyecto />} />

                                <Route path="/roles" element={<CRUDRoles />} />

                                <Route path="/insumos" element={<CRUDInsumos />} />
                                <Route path="/ayudantes" element={<CRUDAyudante />} />
                                <Route path="/tareas" element={<CRUDTarea />} />
                                <Route path="/actividades/:proyectoId" element={<CRUDActividad />} />

                                


                              </Routes>
                            </AppLayout>
                          </TareaProvider>
                        </RolProvider>
                      </AyudanteProvider>
                    </InsumoProvider>
                  </DonacionesProvider>
                </DonadorProvider>
              </BeneficiarioProvider>
            </ProyectoProvider>
          </ActividadProvider>
        </AuthProvider>
      </BrowserRouter>
    </DarkModeProvider>
  );
};

export default App;
