import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { links } from '../data/dummy';
import { useStateContext } from '../context/ContextProvider';
import { useDarkMode } from '../context/DarkModeContext';
import UMSLogo from '../assets/logoums.png'; // Asegúrate de tener la imagen en esta ruta
import '../assets/sideBar.css';
import { jwtDecode } from 'jwt-decode'; // Importar jwt-decode
import Cookies from 'js-cookie';
import {useRoles} from '../context/RolesContext'

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const {roles} = useRoles();
  const { isDarkMode } = useDarkMode();
  const [hoveredItem, setHoveredItem] = useState(null);
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const userTipo = roles.find(tipo=> tipo?._id === decodedToken.usuario?.tipo);
  const userPermisos = userTipo ? userTipo .permisos : [];
  const tienePermiso = (permiso) => {
    return userPermisos .some(p => p?.nombre?.toLowerCase() === permiso?.toLowerCase());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { // Puedes ajustar este valor según tus necesidades
        setActiveMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Verificación inicial en caso de que la ventana ya esté en un tamaño pequeño al cargar
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setActiveMenu]);

  const handleMenuToggle = () => {
    if (window.innerWidth > 768) { // Solo permitir la apertura si el tamaño de la ventana es mayor a 768px
      setActiveMenu(!activeMenu);
    }
  };

  const handleMouseEnter = (itemName) => {
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <aside className={`h-screen fixed top-0 left-0 z-50 self-center bg-gray-100 rounded-2xl dark:bg-gray-800 transition-all duration-300 ease-in-out ${activeMenu ? 'w-[15%]' : 'w-[5%]'}`}>
      <div className="flex flex-col h-full relative">
        <div className={`flex items-center justify-between p-7 ${activeMenu ? '' : 'justify-center'}`}>
          <Link to="/dashboard" onClick={handleMenuToggle} className={`flex items-center gap-3 font-extrabold text-blue-500 dark:text-white ${activeMenu ? '' : 'justify-center'}`}>
            <img src={UMSLogo} alt="UMS Logo" className={`w-${activeMenu ? '8' : '12'} h-${activeMenu ? '8' : '12'}`} />
            <span className={`${activeMenu ? 'block' : 'hidden'}`}>UMS</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {links.map((category, index) => (
            <div key={index}>
              <ul>
                {category.links.filter(link => tienePermiso(link.name))  // Filtrar los enlaces según permisos
                  .map((link) => (
                  <li
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(link.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <NavLink
                      to={`/${link.name}`}
                      className={({ isActive }) => `flex items-center py-3 px-4 m-1 shadow-inner text-lg text-gray-700 dark:text-white  
                      dark:hover:text-black transition-all duration-200 ease-in-out hover:font-bold hover:bg-gradient-to-bl from-indigo-200 to-indigo-500 hover:from-indigo-300 hover:to-indigo-700
                       w-100 ${isActive ? 'text-blue-500 font-bold bg-gradient-to-bl from-indigo-200 to-indigo-500 hover:from-indigo-300 hover:to-indigo-700' : ''} ${activeMenu ? 'text-base' : 'text-sm'} rounded-md `}
                    >
                      {link.icon}
                      <span className={`${activeMenu ? 'block text-base pl-2' : 'hidden'}`}>
                        {link.name}
                      </span>
                    </NavLink>
                    {!activeMenu && hoveredItem === link.name && (
                      <div className="absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 z-50 min-w-max">
                        <span className="text-gray-700 dark:text-gray-200 text-base">{link.name}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
