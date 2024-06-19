import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../context/ContextProvider';
import logoums from '../assets/logoums.png'; // Asegúrate de tener la imagen en esta ruta

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
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
  <div className="absolute top-16 right-0 w-72 bg-white p-4 shadow-lg rounded-lg">
    <h3 className="font-bold mb-2">{title}</h3>
    <p>{message}</p>
  </div>
);

const Navbar = () => {
  const { activeMenu, setActiveMenu, isClicked, handleClick } = useStateContext();
  const [showChat, setShowChat] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Verificación inicial en caso de que la ventana ya esté en un tamaño pequeño al cargar
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

  return (
    <div className="flex justify-between p-2 relative bg-white shadow-md">
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
      <div className="flex items-center gap-4">
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
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <img src={logoums} className="rounded-full w-8 h-8" alt="user-profile" />
            <p className="hidden md:block">
              <span className="text-gray-400 text-14">¡Hola!,</span>
              <span className="text-gray-400 text-14 font-bold ml-1">Administrador</span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {showChat && <MessageBox title="Chat" message="No hay mensajes" />}
        {showNotification && <MessageBox title="Notificaciones" message="No hay notificaciones" />}
      </div>
    </div>
  );
};

export default Navbar;
