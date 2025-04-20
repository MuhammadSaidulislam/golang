import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Page/Login/Login';
import PrivateRoute from './api/PrivateRoute';
import SuperAdmin from './Page/SuperAdmin/SuperAdmin';
import AdminCreate from './Page/AdminCreate/AdminCreate';
import AdminView from './Page/AdminView/AdminView';
import Dashboard from './Page/Dashboard/Dashboard';
import Billing from './Page/Billing/Billing';
import Support from './Page/Support/Support';
import Setting from './Page/Setting/Setting';

const Routing = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>

                            {/* <Route path="/accounts" element={<Accounts />}></Route>
                        <Route path="/accounts/add-account" element={<AddAccount />}></Route>
                        <Route path="/accounts/view-account" element={<ViewAccount />}></Route> */}

                    {/* login */}
                    <Route path="/" element={<Login />}></Route>
                    {/* super admin */}
                    <Route path="/admin-list" element={<SuperAdmin />}></Route>
                    <Route path="/admin-create" element={<AdminCreate />}></Route>
                    <Route path="/admin/:id" element={<AdminView />}></Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                    <Route path="/billing" element={<Billing />}></Route>
                    <Route path="/support" element={<Support />}></Route>
                    <Route path="/settings" element={<Setting />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing