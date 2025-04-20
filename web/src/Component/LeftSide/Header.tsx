import React, { useEffect, useState } from 'react';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bell from "../../Assets/Images/icon/bell-01.svg";
import circle from "../../Assets/Images/icon/info-circle.png";
import arrow from "../../Assets/Images/icon/downIcon.svg";
import userIcon from "../../Assets/Images/icon/assign.svg";
import invoiceDetail from "../../Assets/Images/icon/invoice-detail.svg";
import logout from "../../Assets/Images/icon/logout.png";
import { Dropdown } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { isAuthenticate } from '../../api/auth';
import { DESKIE_API as API } from '../../config';
import { Link } from 'react-router-dom';
import memberIcon from '../../Assets/Images/icon/memberAvatar.svg';

const Header = ({ onValueChange }: any) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [userImage, setUserImage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [notifyList, setNotifyList] = useState<any[]>([]);

    const handleClick = () => {
        setCollapsed(!collapsed)
        onValueChange(collapsed);
    };
    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const urlParams = pathArray[pathArray.length - 1];
    let auth = isAuthenticate();


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredNotify = notifyList.filter((notify: any) =>
        notify.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className='topNavbar'>
                <div className='contentHeading'>
                    <button className="sb-button" onClick={handleClick}><FontAwesomeIcon icon={faBars} /></button>
                    {pathArray.includes("member") ? <p>Members</p> : ""}
                    {pathArray.includes("assets") ? <p>Assets</p> : ""}
                    {pathArray.includes("accounts") ? <p>Accounts</p> : ""}
                    {pathArray.includes("calender") ? <p>Calendar</p> : ""}
                    {pathArray.includes("billing") ? <p>Billing</p> : ""}
                    {pathArray.includes("visitor-log") ? <p>Visitors</p> : ""}
                    {pathArray.includes("tours") ? <p>Tours</p> : ""}
                    {pathArray.includes("invoice-details") ? <p>Billing</p> : ""}
                    {urlParams === "my-invoice" ? <p>Billing</p> : ""}
                    {urlParams === "files" ? <p>Files</p> : ""}
                    {urlParams === "tickets" ? <p>Ticket</p> : ""}
                    {urlParams === "task" ? <p>Tasks</p> : ""}
                    {urlParams === "dashboard" ? <p>Dashboard</p> : ""}
                    {urlParams === "messenger" ? <p>Messages</p> : ""}
                    {urlParams === "feed" ? <p>Feed</p> : ""}
                    {urlParams === "settings" ? <p>Settings</p> : ""}
                    {urlParams === "my-home" ? <p>Home</p> : ""}
                    {pathArray.includes("resources") ? <p>Resources</p> : ""}
                    {pathArray.includes("my-resources") ? <p>My Bookings</p> : ""}
                </div>
                <div className='rightNavbar'>
                    {/* <button className='d-flex align-items-center'><img src={circle} alt="circle" /></button> */}
                    <div className="notificationBox">
                        <Dropdown>
                            <Dropdown.Toggle>
                                <img src={bell} alt="bell" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <div className="notifyHeading">
                                    <p>Notifications</p>
                                    <img src={bell} alt="bell" />
                                </div>
                                {filteredNotify && filteredNotify.length ? <>
                                    <div className='searchInput mt-3'>
                                        <input type="text" placeholder='Search notification' onChange={handleInputChange} className='form-control' />
                                        <FontAwesomeIcon icon={faSearch} />
                                    </div>
                                    <div className="latestHeading">
                                        <h5>LATEST</h5>
                                    </div>
                                    <div className="latestNotify">
                                        {filteredNotify && filteredNotify.map(((notify: any, i) => <Link key={`notify` + i} className="notifyBox" to={`/${userRole === "admin" ? "invoice-details" : "my-invoice-details"}/${notify.id}`}>
                                            <h6>You have a new invoice</h6>
                                            <h5>Invoice : <span>#{notify.invoice_id}</span></h5>
                                            <p>{notify.running_time} ago</p>
                                        </Link>))}
                                    </div>
                                </> : <>
                                    <div className="latestNotify text-center mt-5">
                                        <h6>No new notifications</h6>
                                    </div>
                                </>}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <button className='memberImg'>
                        {userImage && userImage.length ? <img src={`${API}/${userImage}`} style={{ objectFit: "cover" }} alt="logo" />
                            : <img className='default' src={memberIcon} alt="bell" style={{ objectFit: "cover" }} />
                        }
                    </button>
                    <Dropdown>
                        <Dropdown.Toggle>
                            {firstName && firstName} {lastName && lastName} <img style={{marginLeft: "12px"}} src={arrow} alt="arrow" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <div className="navProfile">
                                {userImage && userImage.length ? <img className='logo' src={`${API}/${userImage}`} style={{ objectFit: "cover" }} alt="logo" />
                                    : <img className='logo default' src={memberIcon} alt="bell" style={{ objectFit: "cover" }} />
                                }
                                <h6>{firstName && firstName} {lastName && lastName}</h6>
                                <p>{userRole && userRole === "admin" ? "Admin" : "Member"}</p>
                                {userRole === 'admin' ? <Link to="/settings"><img src={userIcon} alt="admin" /> Profile</Link>
                                    : <Link to="/my-settings"><img src={userIcon} alt="admin" /> Profile</Link>}
                                <Link to="/"><img src={logout} alt="admin" /> Logout</Link>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}

export default Header