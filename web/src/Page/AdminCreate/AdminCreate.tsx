import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'react-bootstrap'
import Layout from '../../Component/Layout/Layout';
import "./AdminCreate.css";
import { v4 as uuidv4 } from 'uuid';
import { adminAdd, loginAdmin } from '../../api/admin';

const AdminCreate = () => {

    const [address, setAddress] = useState('')
    const [typeOpen, setTypeOpen] = useState(false);
    const [portalUrl, setPortalUrl] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedSpaces, setSelectedSpaces] = useState('');
    const [selectedMembers, setSelectedMembers] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');


    const handleTypeToggle = (isOpen: any) => {
        setTypeOpen(isOpen);
    };

    const companyAdd = () => {
        const companyData = {
            id: uuidv4(),
            portalUrl: portalUrl,
            status: selectedStatus,
            plan: selectedPlan,
            spaces: selectedSpaces,
            members: selectedMembers,
            adminEmail: adminEmail,
            adminPassword: adminPassword,
            companyName: companyName,
            companyEmail: companyEmail,
            companyPhoneNumber: companyPhoneNumber,
            companyWebsite: companyWebsite,
            address: address,
        };
        // console.log('Company Data:', companyData);
        // Perform the API call or any other action with the collected data
        adminAdd(companyData).then((data) => {
            console.log('Company Data:', data);
         })
    };
    return (
        <Layout>
            <div className='mainContent'>
                <div className="invoiceHeading">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 ms-2">
                            <li className="breadcrumb-item"><Link to="/admin-list">Accounts</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Create New Account</li>
                        </ol>
                    </nav>
                </div>
                <div className="memberBox">
                    <div className='tableHeading add-account-wrapper'>
                        <div className="topLine">

                            <div className='tableHeading'>
                                <h6>Create New Account</h6>
                            </div>
                            <div className='profileSave' style={{ display: 'flex' }}>
                                <button className='cancel add-account-button-flex'>Cancel</button>
                                <button type='submit' onClick={companyAdd} className='save add-account-button-flex' >Save</button>
                            </div>
                        </div>
                        <div className='tableHeading add-account-wrapper'>
                            <p className='add-account-heading'>Account Overview</p>
                            <p className='create-account-subHeading'>Update account info here.</p>
                            <div className='add-account-divider'></div>
                            <div className='add-account-section-flex'>
                                <p className='add-account-title'>Account Details</p>
                                <div className="inputField resourceName  add-account-padding" >
                                    <span>Portal URL</span>
                                    <input
                                        type="text"
                                        placeholder='buzzcoworking'
                                        className='form-control'
                                        value={portalUrl}
                                        onChange={(e) => setPortalUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='add-account-divider'></div>
                            <div className='add-account-section-flex'>
                                <p className='add-account-title'>Plan Details</p>
                                <div className='add-account-input-group' >
                                    <div className="dropdownInput  add-account-padding">
                                        <div className={typeOpen ? "dropdownField-focused" : "dropdownField"}>
                                            <span>Status</span>
                                            <Dropdown
                                                onToggle={handleTypeToggle}
                                                onSelect={(e) => setSelectedStatus(e as string)}
                                                className='dropdown-menu-margin '
                                            >
                                                <Dropdown.Toggle variant="" className="custom-toggle">
                                                    {selectedStatus.length ? selectedStatus : "Select status"}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className='dropdown-edge'>
                                                    <Dropdown.Item eventKey="active">Active</Dropdown.Item>
                                                    <Dropdown.Item eventKey="disable">Disable</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <div className="inputSvg">
                                                <FontAwesomeIcon icon={faSortDown} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropdownInput  add-account-padding">
                                        <div className={typeOpen ? "dropdownField-focused" : "dropdownField"}>
                                            <span>Plan</span>
                                            <Dropdown
                                                onToggle={handleTypeToggle}
                                                onSelect={(e) => setSelectedPlan(e as string)}
                                                className='dropdown-menu-margin '
                                            >
                                                <Dropdown.Toggle variant="" className="custom-toggle">
                                                    {selectedPlan.length ? selectedPlan : "Select plan"}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className='dropdown-edge'>
                                                    <Dropdown.Item eventKey="core">Core</Dropdown.Item>
                                                    <Dropdown.Item eventKey="premium">Premium</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <div className="inputSvg">
                                                <FontAwesomeIcon icon={faSortDown} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='add-account-dropdown-flex'>
                                        <div className="dropdownInput  add-account-padding">
                                            <div className={typeOpen ? "dropdownField-focused" : "dropdownField"}>
                                                <span>Spaces</span>
                                                <Dropdown
                                                    onToggle={handleTypeToggle}
                                                    onSelect={(e) => setSelectedSpaces(e as string)}
                                                    className='dropdown-menu-margin '
                                                >
                                                    <Dropdown.Toggle variant="" className="custom-toggle">
                                                        {selectedSpaces.length ? selectedSpaces : "Select spaces"}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className='dropdown-edge'>
                                                        {[...Array(10)].map((_, index) => (
                                                            <Dropdown.Item key={index + 1} eventKey={(index + 1).toString()}>
                                                                {index + 1}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <div className="inputSvg">
                                                    <FontAwesomeIcon icon={faSortDown} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdownInput  add-account-padding">
                                            <div className={typeOpen ? "dropdownField-focused" : "dropdownField"}>
                                                <span>Members</span>
                                                <Dropdown
                                                    onToggle={handleTypeToggle}
                                                    onSelect={(e) => setSelectedMembers(e as string)}
                                                    className='dropdown-menu-margin '
                                                >
                                                    <Dropdown.Toggle variant="" className="custom-toggle">
                                                        {selectedMembers.length ? selectedMembers : "Select members"}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className='dropdown-edge'>
                                                        {[...Array(10)].map((_, index) => (
                                                            <Dropdown.Item key={index + 1} eventKey={(index + 1).toString()}>
                                                                {index + 1}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <div className="inputSvg">
                                                    <FontAwesomeIcon icon={faSortDown} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='add-account-divider'></div>
                            <div className='add-account-section-flex'>
                                <p className='add-account-title'>Admin Details</p>
                                <div className='add-account-input-group'>
                                    <div className="inputField resourceName  add-account-padding">
                                        <span>Email</span>
                                        <input
                                            type="email"
                                            placeholder='Enter your name'
                                            className='form-control'
                                            value={adminEmail}
                                            onChange={(e) => setAdminEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="inputField resourceName  add-account-padding">
                                        <span>Password</span>
                                        <input
                                            type="text"
                                            placeholder='Enter Password'
                                            className='form-control'
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='add-account-divider'></div>
                            <p className='add-account-heading'>Company Details</p>
                            <p className='create-account-subHeading'>Update company info here.</p>
                            <div className='add-account-divider'></div>
                            <div className='add-account-section-flex'>
                                <p className='add-account-title'>Company Name</p>
                                <div className="inputField resourceName  add-account-padding">
                                    <span>Name</span>
                                    <input
                                        type="text"
                                        placeholder='Enter your name'
                                        className='form-control'
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='add-account-divider'></div>
                            <div className='add-account-section-flex'>
                                <p className='add-account-title'>Contact Details</p>
                                <div className='add-account-input-group'>
                                    <div className="inputField resourceName  add-account-padding">
                                        <span>Email</span>
                                        <input
                                            type="email"
                                            placeholder='Enter company email'
                                            className='form-control'
                                            value={companyEmail}
                                            onChange={(e) => setCompanyEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="inputField resourceName  add-account-padding">
                                        <span>Phone Number</span>
                                        <input
                                            type="text"
                                            placeholder='Enter phone number'
                                            className='form-control'
                                            value={companyPhoneNumber}
                                            onChange={(e) => setCompanyPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="inputField resourceName  add-account-padding">
                                        <span>Website</span>
                                        <input
                                            type="text"
                                            placeholder='Enter website'
                                            className='form-control'
                                            value={companyWebsite}
                                            onChange={(e) => setCompanyWebsite(e.target.value)}
                                        />
                                    </div>
                                    <div className="companyInput address mt-2 add-account-padding" style={{ width: '100%' }}>
                                        <span>Address</span>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder='512 Delaware Street, Kansas City, MO 64105'
                                            className='form-control'
                                            rows={3}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminCreate