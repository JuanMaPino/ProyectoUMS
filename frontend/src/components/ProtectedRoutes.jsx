import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
    const token = Cookies.get('token');

    if(!token) {
        console.log('PERROHIJUEPUTA, Sin token no hay acceso ☢');
        return<Navigate to= "/login" />;
    }

    return <Outlet/>
};
  

export default ProtectedRoute;