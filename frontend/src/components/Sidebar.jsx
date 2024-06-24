import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { links } from '../data/dummy';
import { useStateContext } from '../context/ContextProvider';
import { useDarkMode } from '../context/DarkModeContext';
import UMSLogo from '../assets/logoums.png'; // Asegúrate de tener la imagen en esta ruta
import '../assets/sideBar.css';

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const { isDarkMode } = useDarkMode();
  const [hoveredItem, setHoveredItem] = useState(null);

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
    <aside className={`h-screen fixed top-0 left-0 z-50 self-center bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${activeMenu ? 'w-[15%]' : 'w-[5%]'}`}>
      <div className="flex flex-col h-full relative">
        <div className={`flex items-center justify-between p-4 ${activeMenu ? '' : 'justify-center'}`}>
          <Link to="/" onClick={handleMenuToggle} className={`flex items-center gap-3 font-extrabold text-blue-500 dark:text-white ${activeMenu ? '' : 'justify-center'}`}>
            <img src={UMSLogo} alt="UMS Logo" className={`w-${activeMenu ? '8' : '12'} h-${activeMenu ? '8' : '12'}`} />
            <span className={`${activeMenu ? 'block' : 'hidden'}`}>UMS</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {links.map((category, index) => (
            <div key={index}>
              <p className={`text-gray-400 dark:text-gray-400 m-2 mt-4 uppercase ${activeMenu ? 'block' : 'hidden'}`}>
                {category.title}
              </p>
              <ul>
                {category.links.map((link) => (
                  <li
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(link.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <NavLink
                      to={`/${link.name}`}
                      className={({ isActive }) => `flex items-center py-3 px-4 m-1 shadow-inner text-lg text-gray-700 dark:text-gray-200 
                      dark:hover:text-black transition-all duration-200 ease-in-out hover:font-bold hover:bg-gradient-to-bl from-blue-200 to-blue-500
                       hover:from-blue-300 hover:to-blue-700 w-100 ${isActive ? 'text-blue-500 font-bold bg-gradient-to-bl from-blue-200 to-blue-500 hover:from-blue-300 hover:to-blue-700' : ''} ${activeMenu ? 'text-base' : 'text-sm'} rounded-md `}
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
