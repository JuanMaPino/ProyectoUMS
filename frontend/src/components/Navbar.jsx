import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useUsuarios } from '../context/UsuariosContext';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../context/ContextProvider';
import { useDarkMode } from '../context/DarkModeContext';
import logoums from '../assets/logoums.png'; // Asegúrate de tener la imagen en esta ruta
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importar jwt-decode
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray dark:hover:bg-gray-600"
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
      {icon}
    </button>
  </TooltipComponent>
);

const MessageBox = ({ title, message }) => (
  <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg">
    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

const Navbar = () => {
  const { activeMenu, setActiveMenu, isClicked, handleClick } = useStateContext();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showChat, setShowChat] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChatClick = () => {
    setShowChat(!showChat);
    setShowNotification(false);
  };

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
    setShowChat(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirigir al login después de cerrar sesión
    } catch (err) {
      console.error("Error de cerrar sesión", err);
    }
  };
  const users = async () => {
    navigate('/usuarios')
  }

  return (
    <div className={`flex justify-between p-2 relative bg-white dark:bg-gray-800 shadow-md`}>
      <div>
        {!isSmallScreen && (
          <NavButton
            title="Menu"
            customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
            color="blue"
            icon={<AiOutlineMenu />}
          />
        )}
      </div>
      {/* <div className="flex items-center gap-4">
        <NavButton
          title="Chat"
          dotColor="#03C9D7"
          customFunc={handleChatClick}
          color="blue"
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notification"
          dotColor="#03C9D7"
          customFunc={handleNotificationClick}
          color="blue"
          icon={<RiNotification3Line />}
        />
        <NavButton
          title="Toggle Dark Mode"
          customFunc={toggleDarkMode}
          color="blue"
          icon={isDarkMode ? <FiSun /> : <FiMoon />}
        /> */}

        {/* Perfil de usuario con menú desplegable */}
        <div className="relative">
          <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray dark:hover:bg-gray-600 rounded-lg"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={logoums} className="rounded-full w-8 h-8" alt="user-profile" />
              <p className="hidden md:block">
                <span className="text-gray-400 text-14">¡Hola!,</span>
                <span className="text-gray-400 text-14 font-bold ml-1"> {decodedToken.usuario.usuario}</span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </div>
          </TooltipComponent>

          {/* Menú desplegable */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
              <ul>
                <li className="px-4 py-2 hover:bg-light-gray dark:hover:bg-gray-600 cursor-pointer"
                onClick={users}>
                  Usuarios
                </li>
                <li
                  className="px-4 py-2 hover:bg-light-gray dark:hover:bg-gray-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </li>
              </ul>
            </div>
          )}
        </div>

        {showChat && <MessageBox title="Chat" message="No hay mensajes" />}
        {showNotification && <MessageBox title="Notificaciones" message="No hay notificaciones" />}
      </div>
  );
};

export default Navbar;
