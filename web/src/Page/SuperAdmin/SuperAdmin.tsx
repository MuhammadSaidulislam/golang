import React,{useEffect,useState} from 'react';
import Layout from '../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import {  useNavigate } from 'react-router-dom';
import filter from '../../Assets/Images/icon/filter-lines.svg';
import { Table } from 'react-bootstrap';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import "./SuperAdmin.css"
import { adminList } from '../../api/admin';

const SuperAdmin = () => {
    const navigate = useNavigate();
    const [adminLists, setAdminLists] = useState([]);
    useEffect(() => {
        adminList().then((data) => {
            console.log('admin',data); 
            setAdminLists(data)          
        })
    }, []);
  return (
    <Layout>
            <div className='mainContent'>
                <div className="memberBox">
                    <div className="topLine">
                        <div className='tableHeading'>
                            <h6>All Accounts</h6>
                        </div>
                        <div className='memberSearch'>
                            <div className='searchInput'>
                                <input type="text" placeholder='Search accounts' className='form-control' />
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                            <button className='filterBtn'><img className='mr-2' src={filter} alt='filter' /> Filter</button>
                            <button onClick={() => navigate('/admin-create')}><FontAwesomeIcon icon={faPlus} />Create New Account</button>
                        </div>
                    </div>

                    <div className="spaceList">
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th><label className="tableCheckBox">
                                        <div className="contactCheck">
                                            <input type="checkbox" name="agreement" />
                                            <span className="checkmark"></span></div>
                                    </label></th>
                                    <th className='sortArrow'>Company</th>
                                    <th className='sortArrow'>Portal URL</th>
                                    <th className='sortArrow'>Admin User</th>
                                    <th className='sortArrow'>Status</th>
                                    <th>Plan</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminLists.map((admin:any)=><tr key="staticRow">
                                <td>
                                    <label className="tableCheckBox">
                                        <div className="contactCheck">
                                            <input type="checkbox" name="agreement" />
                                            <span className="checkmark"></span>
                                        </div>
                                    </label>
                                </td>
                                <td className="tableLink">
                                    <a href="/accounts/view-account">{admin.name}</a>
                                </td>
                                <td>
                                    <span className="account-row-text">{admin.company_url}</span>
                                </td>
                                <td className="rate">{admin.email}</td>
                                <td className="status">
                                    <span className="account-active">{admin.status}</span>
                                </td>
                                <td>
                                    <span className="account-plan-text">{admin.plan}</span>
                                </td>
                                <td className="tableAction">
                                    <button className="btn view" onClick={() => navigate(`/admin/${admin.id}`)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </td>
                            </tr>)}
                            </tbody>
                        </Table>
                        {/* <Pagination page={page} paginationTitle="items" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={spaces} /> */}
                    </div>
                </div>
            </div>
        </Layout>
  )
}

export default SuperAdmin