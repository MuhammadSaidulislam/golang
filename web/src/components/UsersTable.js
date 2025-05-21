import React, { useEffect, useState } from 'react';
import { API, showError, showSuccess } from '../helpers';
import {
  Button,
  Form,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
} from '@douyinfe/semi-ui';
import { ITEMS_PER_PAGE } from '../constants';
import { renderGroup, renderNumber, renderQuota } from '../helpers/render';
import AddUser from '../pages/User/AddUser';
import EditUser from '../pages/User/EditUser';
import { useTranslation } from 'react-i18next';
import { Table, Dropdown } from "react-bootstrap";
import { SortIconSvg } from './svgIcon';
import { EditIconSvg } from './svgIcon.js';
import { IconArrowUpLeft, IconAscend, IconChevronDown, IconDoubleChevronLeft, IconFilledArrowDown, IconFilledArrowUp, IconPlus, IconSearch, IconChevronRight, IconChevronLeft } from '@douyinfe/semi-icons';
import deleteIcon from "../assets/Delete.svg";
import disableIcon from "../assets/fi_disable.svg";
import editIcon from "../assets/fi_edit-2.svg";
import chatIcon from "../assets/fi_chat_2.svg";
import copyIcon from "../assets/u_copy-alt.svg";
import enableIcon from "../assets/fi_check.svg";

const UsersTable = () => {
  const { t } = useTranslation();

  function renderRole(role) {
    switch (role) {
      case 1:
        return <span>{t('普通用户')}</span>;
      case 10:
        return (
          <span>
            {t('管理员')}
          </span>
        );
      case 100:
        return (
          <span>
            {t('超级管理员')}
          </span>
        );
      default:
        return (
          <span>
            {t('未知身份')}
          </span>
        );
    }
  }


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchGroup, setSearchGroup] = useState('');
  const [groupOptions, setGroupOptions] = useState([]);
  const [userCount, setUserCount] = useState(ITEMS_PER_PAGE);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState({
    id: undefined,
  });
  const [userShow, setUserShow] = useState(false);
  const handleUserClose = () => {
    setUserShow(false);
  }
  const [updateShow, setUpdateShow] = useState(false);
  const handleUpdateClose = () => {
    setUpdateShow(false);
  }
  const [sizeArray, setSizeArray] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [itemRange, setItemRange] = useState('');


  const removeRecord = (key) => {
    let newDataSource = [...users];
    if (key != null) {
      let idx = newDataSource.findIndex((data) => data.id === key);

      if (idx > -1) {
        // update deletedAt
        newDataSource[idx].DeletedAt = new Date();
        setUsers(newDataSource);
      }
    }
  };

  const setUserFormat = (users) => {
    for (let i = 0; i < users.length; i++) {
      users[i].key = users[i].id;
    }
    setUsers(users);
  }

  const loadUsers = async (startIdx, pageSize) => {
    const res = await API.get(`/api/user/?p=${startIdx}&page_size=${pageSize}`);
    const { success, message, data } = res.data;
    if (success) {
      const newPageData = data.items;
      setActivePage(data.page);
      setUserCount(data.total);
      setUserFormat(newPageData);
      // data range 
      const startItem = (startIdx - 1) * pageSize + 1;
      const endItem = Math.min(startIdx * pageSize, data.total);
      const itemRange = `<b>${startItem}</b> - <b>${endItem}</b> of <b>${data.total}</b> items`;
      setItemRange(itemRange);
      // data dropdown
      const sizeArray = [];
      for (let i = 10; i < data.total; i += 10) {
        sizeArray.push(i);
      }
      sizeArray.push(data.total);
      setSizeArray(sizeArray);
      // pagination list
      const totalPages = Math.ceil(data.total / pageSize);
      const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
      setSizeList(paginationArray);
    } else {
      showError(message);
    }
    setLoading(false);
  };


  useEffect(() => {
    loadUsers(activePage, pageSize)
      .then()
      .catch((reason) => {
        showError(reason);
      });
    fetchGroups().then();
  }, [activePage, pageSize]);

  const manageUser = async (userId, action, record) => {
    const res = await API.post('/api/user/manage', {
      id: userId,
      action,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作成功完成！');
      let user = res.data.data;
      let newUsers = [...users];
      if (action === 'delete') {
      } else {
        record.status = user.status;
        record.role = user.role;
      }
      setUsers(newUsers);
    } else {
      showError(message);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return <Tag size='large'>{t('已激活')}</Tag>;
      case 2:
        return (
          <Tag size='large' color='red'>
            {t('已封禁')}
          </Tag>
        );
      default:
        return (
          <Tag size='large' color='grey'>
            {t('未知状态')}
          </Tag>
        );
    }
  };

  const searchUsers = async (startIdx, pageSize, searchKeyword, searchGroup) => {
    if (searchKeyword === '' && searchGroup === '') {
      // if keyword is blank, load files instead.
      await loadUsers(startIdx, pageSize);
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/user/search?keyword=${searchKeyword}&group=${searchGroup}&p=${startIdx}&page_size=${pageSize}`);
    const { success, message, data } = res.data;
    if (success) {
      const newPageData = data.items;
      setActivePage(data.page);
      setUserCount(data.total);
      setUserFormat(newPageData);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.target.value);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (searchKeyword === '' && searchGroup === '') {
      loadUsers(page, pageSize).then();
    } else {
      searchUsers(page, pageSize, searchKeyword, searchGroup).then();
    }
  };

  const closeAddUser = () => {
    setShowAddUser(false);
  };

  const closeEditUser = () => {
    setShowEditUser(false);
    setEditingUser({
      id: undefined,
    });
  };

  const refresh = async () => {
    setActivePage(1)
    if (searchKeyword === '') {
      await loadUsers(activePage, pageSize);
    } else {
      await searchUsers(searchKeyword, searchGroup);
    }
  };

  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      // add 'all' option
      // res.data.data.unshift('all');
      if (res === undefined) {
        return;
      }
      setGroupOptions(
        res.data.data.map((group) => ({
          label: group,
          value: group,
        })),
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const handlePageSizeChange = async (size) => {
    localStorage.setItem('page-size', size + '');
    setPageSize(size);
    setActivePage(1);
    loadUsers(activePage, size)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  };

  return (
    <>
      <AddUser
        refresh={refresh}
        visible={showAddUser}
        handleClose={closeAddUser}
        userShow={userShow}
        handleUserClose={handleUserClose}
      ></AddUser>
      <EditUser
        refresh={refresh}
        visible={showEditUser}
        handleClose={closeEditUser}
        editingUser={editingUser}
        updateShow={updateShow}
        handleUpdateClose={handleUpdateClose}
      ></EditUser>


      <Form
        onSubmit={() => {
          searchUsers(activePage, pageSize, searchKeyword, searchGroup);
        }}
        labelPosition='left'
      >
        <div className='userHeadBox'>
          <div className='d-flex align-items-center w-100'>
            <Tooltip content={t('支持搜索用户的 ID、用户名、显示名称和邮箱地址')}>
              <div className="search-container" style={{ width: "205px" }}>
                <i className="search-icon"><IconSearch /></i>
                <input type="text" className="search-input" placeholder={t('搜索关键字')} value={searchKeyword} onChange={handleKeywordChange} />
              </div>
            </Tooltip>
            <Form.Select
              field='group'
              label={t('分组')}
              optionList={groupOptions}
              onChange={(value) => {
                setSearchGroup(value);
                searchUsers(activePage, pageSize, searchKeyword, value);
              }}
            />
            <button className='searchBtn' type="submit" style={{ marginLeft: '10px' }}>
              {t('查询')}
            </button>
          </div>

          <button className='searchBtn' style={{ marginRight: 8, textWrap: 'nowrap' }} onClick={() => setUserShow(true)} >
            <IconPlus /> {t('添加用户')}
          </button>
        </div>
      </Form>

      <div className="tableData">
        <div className='tableBox'>
          <Table borderless hover>
            <thead>
              <tr>
                <th>{t('ID')}</th>
                <th>{t('用户名')}</th>
                <th>{t('分组')}</th>
                <th>{t('剩余额度')}</th>
                <th>{t('已用额度')}</th>
                <th>{t('调用次数')}</th>
                <th>{t('邀请信息')}</th>
                <th>{t('邀请总收益')}</th>
                <th>{t('邀请人ID')}</th>
                <th>{t('角色')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => <tr>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{renderGroup(user.group)}</td>
                <td>{renderQuota(user.quota)}</td>
                <td>{renderQuota(user.used_quota)}</td>
                <td>{renderNumber(user.request_count)}</td>
                <td>{renderNumber(user.aff_count)}</td>
                <td>{renderQuota(user.aff_history_quota)}</td>
                <td>
                  {user.inviter_id === 0 ? (
                    <span>
                      {t('无')}
                    </span>
                  ) : (
                    <span>
                      {user.inviter_id}
                    </span>
                  )}
                </td>
                <td>{renderRole(user.role)}</td>
                <td className='tableActions'>
                  {user.DeletedAt !== null ? (
                    ""
                  ) : (
                    <>
                      { /* */}
                      <Popconfirm
                        title={t('确定？')}
                        okType={'warning'}
                        onConfirm={() => {
                          manageUser(user.id, user?.role === 1 ? "promote" : "demote", user);
                        }}
                      >
                        {user?.role === 1 ? <Button theme='light' type='warning' style={{ marginRight: '2px' }}>
                          <IconFilledArrowUp />
                        </Button> : <Button theme='light' type='secondary' style={{ marginRight: '2px' }}>
                          <IconFilledArrowDown />
                        </Button>}
                      </Popconfirm>

                      {user.status === 1 ? (
                        <button style={{ marginRight: '2px' }} onClick={async () => { manageUser(user.id, 'disable', user); }}  >
                          <img src={disableIcon} alt="tableAction" />
                        </button>
                      ) : (
                        <button style={{ marginRight: '2px' }} onClick={async () => {
                          manageUser(user.id, 'enable', user);
                        }} disabled={user.status === 3} >
                          <img src={enableIcon} alt="tableAction" />
                        </button>
                      )}
                      <button style={{ marginRight: '2px' }} onClick={() => { setEditingUser(user); setUpdateShow(true); }}   >
                        <EditIconSvg color="--semi-table-thead-0" />
                      </button>
                      <Popconfirm
                        title={t('确定是否要注销此用户？')}
                        content={t('相当于删除用户，此修改将不可逆')}
                        okType={'danger'}
                        position={'left'}
                        onConfirm={() => {
                          manageUser(user.id, 'delete', user).then(() => {
                            removeRecord(user.id);
                          });
                        }}
                      >
                        <button style={{ marginRight: '2px' }}>
                          <img src={deleteIcon} alt="tableAction" />
                        </button>
                      </Popconfirm>
                    </>
                  )}
                </td>
              </tr>)}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="tablePagination">
        <div className="leftItems">
          <Dropdown className="bulkDropdown">
            <Dropdown.Toggle id="dropdown-basic">{pageSize}</Dropdown.Toggle>
            <Dropdown.Menu>
              {sizeArray && sizeArray.map((size) => (
                <Dropdown.Item onClick={() => { setPageSize(size); setActivePage(1); }}>
                  {size}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <p className="itemNumber" dangerouslySetInnerHTML={{ __html: itemRange }}></p>
        </div>

        <div className="leftItems">
          <button className="pagArrow" onClick={() => setActivePage((prev) => prev - 1)} disabled={activePage === 1}>
            <IconChevronLeft />
          </button>
          <div>
            {sizeList && sizeList.map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                disabled={activePage === page}
                className={activePage === page ? 'activePagination' : ""}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="pagArrow" onClick={() => setActivePage((prev) => prev + 1)} disabled={sizeList[sizeList.length - 1] === activePage}>
            <IconChevronRight />
          </button>
        </div>
      </div>


      { /*  <Table
        columns={columns}
        dataSource={users}
        pagination={{
          formatPageText: (page) =>
            t('第 {{start}} - {{end}} 条，共 {{total}} 条', {
              start: page.currentStart,
              end: page.currentEnd,
              total: users.length
            }),
          currentPage: activePage,
          pageSize: pageSize,
          total: userCount,
          pageSizeOpts: [10, 20, 50, 100],
          showSizeChanger: true,
          onPageSizeChange: (size) => {
            handlePageSizeChange(size);
          },
          onPageChange: handlePageChange,
        }}
        loading={loading}
      /> */}
    </>
  );
};

export default UsersTable;
