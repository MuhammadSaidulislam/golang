import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import { isAuthenticate } from './auth';

const PrivateRoute = () => {
    let auth = isAuthenticate();
    return(auth.user?.role === "admin" ? <Outlet /> : <Navigate to="/" />)
}

export default PrivateRoute