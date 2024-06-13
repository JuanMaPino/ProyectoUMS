import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { links } from '../data/dummy';
import { useStateContext } from '../context/ContextProvider';
import UMSLogo from '../assets/logoums.png'; // Asegúrate de tener la imagen en esta ruta

import '../assets/sideBar.css';

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const iconSize = activeMenu ? "text-3xl" : "text-4xl"; // Tamaño de los iconos basado en el estado de activeMenu

  return (
    <aside className={`h-screen fixed top-0 left-0 z-50 self-center bg-white shadow-lg transition-all duration-300 ease-in-out ${activeMenu ? 'w-[15%]' : 'w-[5%] '}`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between p-4 ${activeMenu ? '' : 'justify-center'}`}>
          <Link to="/" onClick={() => setActiveMenu(false)} className={`flex items-center gap-3 font-extrabold text-blue-500 dark:text-white ${activeMenu ? '' : 'justify-center'}`}>
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
                  <li key={link.name}>
                    <NavLink
                      to={`/${link.name}`}
                      onClick={() => {}}
                      className={({ isActive }) => `flex items-center py-3 px-4 m-1  text-lg text-gray-700 dark:text-gray-200 dark:hover:text-black transition-all duration-200 ease-in-out hover:font-bold hover:bg-blue-400 w-100${isActive ? 'text-blue-500 font-bold bg-blue-400 items-center' : ''} ${activeMenu ? 'text-base' : 'text-sm '} rounded-md `}>
                      {link.icon}
                      <span className={`${activeMenu ? 'block text-base pl-2' : 'hidden text-sm pl-2 '}`}>
                        {link.name}
                      </span>
                    </NavLink>
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
