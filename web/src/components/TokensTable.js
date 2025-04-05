import React, { useEffect, useState, userRef } from 'react';
import {
  API,
  copy,
  showError,
  showSuccess,
  timestamp2string,
} from '../helpers';
import { ITEMS_PER_PAGE } from '../constants';
import { formatDate, renderGroup, renderQuota } from '../helpers/render';
import {
  Button, Divider,
  Form,
  Modal,
  Popconfirm,
  Popover, Space,
  SplitButtonGroup,
  Tag,
} from '@douyinfe/semi-ui';
import { Dropdown, Table } from "react-bootstrap";
import Icon, { IconArrowDown, IconChevronDown, IconChevronLeft, IconChevronRight, IconCode, IconCodeStroked, IconLanguage, IconPlus, IconSearch, IconTreeTriangleDown } from '@douyinfe/semi-icons';
import EditToken from '../pages/Token/EditToken';
import { useTranslation } from 'react-i18next';
import NoData from './NoData';
import codeIcon from "../assets/fi_code.svg";
import trendingIcon from "../assets/fi_trending-up.svg";
import summaryIcon from "../assets/fi_ticket.svg";
import sortIcon from "../assets/sort.svg";
import ModalToken from '../pages/Token/ModalToken';
import deleteIcon from "../assets/Delete.svg";
import disableIcon from "../assets/fi_disable.svg";
import editIcon from "../assets/fi_edit-2.svg";
import chatIcon from "../assets/fi_chat_2.svg";
import copyIcon from "../assets/u_copy-alt.svg";
import TablePagination from './TablePagination';
import { SortIconSvg } from './svgIcon';
import enableIcon from "../assets/fi_check.svg";

function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}

const TokensTable = () => {

  const { t } = useTranslation();
  const [tokenList, setTokenList] = useState([]);
  const renderStatus = (status, model_limits_enabled = false) => {
    switch (status) {
      case 1:
        if (model_limits_enabled) {
          return (
            <Tag color='green' size='large'>
              {t('已启用：限制模型')}
            </Tag>
          );
        } else {
          return (
            <Tag color='green' size='large'>
              {t('已启用')}
            </Tag>
          );
        }
      case 2:
        return (
          <Tag color='red' size='large'>
            {t('已禁用')}
          </Tag>
        );
      case 3:
        return (
          <Tag color='yellow' size='large'>
            {t('已过期')}
          </Tag>
        );
      case 4:
        return (
          <Tag color='grey' size='large'>
            {t('已耗尽')}
          </Tag>
        );
      default:
        return (
          <Tag color='black' size='large'>
            {t('未知状态')}
          </Tag>
        );
    }
  };

  const columns = [


    {
      title: '',
      dataIndex: 'operate',
      render: (text, record, index) => {
        let chats = localStorage.getItem('chats');
        let chatsArray = []
        let chatLink = localStorage.getItem('chat_link');
        let mjLink = localStorage.getItem('chat_link2');
        let shouldUseCustom = true;
        if (chatLink) {
          shouldUseCustom = false;
          chatLink += `/#/?settings={"key":"{key}","url":"{address}"}`;
          chatsArray.push({
            node: 'item',
            key: 'default',
            name: 'ChatGPT Next Web',
            onClick: () => {
              onOpenLink('default', chatLink, record);
            },
          });
        }
        if (mjLink) {
          shouldUseCustom = false;
          mjLink += `/#/?settings={"key":"{key}","url":"{address}"}`;
          chatsArray.push({
            node: 'item',
            key: 'mj',
            name: 'ChatGPT Next Midjourney',
            onClick: () => {
              onOpenLink('mj', mjLink, record);
            },
          });
        }
        if (shouldUseCustom) {
          try {
            chats = JSON.parse(chats);
            if (Array.isArray(chats)) {
              for (let i = 0; i < chats.length; i++) {
                let chat = {}
                chat.node = 'item';
                for (let key in chats[i]) {
                  if (chats[i].hasOwnProperty(key)) {
                    chat.key = i;
                    chat.name = key;
                    chat.onClick = () => {
                      onOpenLink(key, chats[i][key], record);
                    }
                  }
                }
                chatsArray.push(chat);
              }
            }

          } catch (e) {
            console.log(e);
            showError(t('聊天链接配置错误，请联系管理员'));
          }
        }
        return (
          <div>


            <SplitButtonGroup
              style={{ marginRight: 1 }}
              aria-label={t('项目操作按钮组')}
            >
              <Button
                theme='light'
                style={{ color: 'rgba(var(--semi-teal-7), 1)' }}
                onClick={() => {
                  if (chatsArray.length === 0) {
                    showError(t('请联系管理员配置聊天链接'));
                  } else {
                    onOpenLink('default', chats[0][Object.keys(chats[0])[0]], record);
                  }
                }}
              >
                {t('聊天')}
              </Button>
              <Dropdown
                trigger='click'
                position='bottomRight'
                menu={chatsArray}
              >
                <Button
                  style={{
                    padding: '8px 4px',
                    color: 'rgba(var(--semi-teal-7), 1)',
                  }}
                  type='primary'
                  icon={<IconTreeTriangleDown />}
                ></Button>
              </Dropdown>
            </SplitButtonGroup>

          </div>
        );
      },
    },
  ];

  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [showEdit, setShowEdit] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [tokenCount, setTokenCount] = useState(pageSize);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchToken, setSearchToken] = useState('');
  const [searching, setSearching] = useState(false);
  const [chats, setChats] = useState([]);
  const [editingToken, setEditingToken] = useState({
    id: undefined,
  });

  const closeEdit = () => {
    setShowEdit(false);
    setTimeout(() => {
      setEditingToken({
        id: undefined,
      });
    }, 500);
  };

  const setTokensFormat = (tokens) => {
    setTokens(tokens);
    if (tokens.length >= pageSize) {
      setTokenCount(tokens.length + pageSize);
    } else {
      setTokenCount(tokens.length);
    }
  };

  let pageData = tokens.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  );

  const loadTokens = async (startIdx) => {
    setLoading(true);
    const res = await API.get(`/api/token/?p=${startIdx}&size=${pageSize}`);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setTokensFormat(data);
        setTokenList(data);
      } else {
        let newTokens = [...tokens];
        newTokens.splice(startIdx * pageSize, data.length, ...data);
        setTokensFormat(newTokens);
        setTokenList(data);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const refresh = async () => {
    await loadTokens(activePage - 1);
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess(t('已复制到剪贴板！'));
    } else {
      Modal.error({
        title: t('无法复制到剪贴板，请手动复制'),
        content: text,
        size: 'large',
      });
    }
  };

  const onOpenLink = async (type, url, record) => {
    console.log(type, url, record);
    let status = localStorage.getItem('status');
    let serverAddress = '';
    if (status) {
      status = JSON.parse(status);
      serverAddress = status.server_address;
    }
    if (serverAddress === '') {
      serverAddress = window.location.origin;
    }
    let encodedServerAddress = encodeURIComponent(serverAddress);
    url = url.replaceAll('{address}', encodedServerAddress);
    url = url.replaceAll('{key}', 'sk-' + record.key);

    window.open(url, '_blank');
  };

  // useEffect(() => {
  //   loadTokens(0)
  //     .then()
  //     .catch((reason) => {
  //       showError(reason);
  //     });
  // }, [pageSize]);

  const removeRecord = (key) => {

    let newDataSource = [...tokens];
    if (key != null) {
      let idx = newDataSource.findIndex((data) => data.key === key);
      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setTokensFormat(newDataSource);
        showSuccess('操作成功完成！');
      }
    }
  };

  const manageToken = async (id, action, record) => {
    setLoading(true);
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/token/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/token/?status_only=true', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/token/?status_only=true', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作成功完成！');
      let token = res.data.data;
      let newTokens = [...tokens];
      if (action === 'delete') {
      } else {
        record.status = token.status;
      }
      setTokensFormat(newTokens);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const searchTokens = async () => {
    if (searchKeyword === '' && searchToken === '') {
      // if keyword is blank, load files instead.
      await loadTokens(0);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(
      `/api/token/search?keyword=${searchKeyword}&token=${searchToken}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      setTokensFormat(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.target.value);
  };

  const handleSearchTokenChange = async (value) => {
    setSearchToken(value.trim());
  };

  const sortToken = (key) => {
    if (tokens.length === 0) return;
    setLoading(true);
    let sortedTokens = [...tokens];
    sortedTokens.sort((a, b) => {
      return ('' + a[key]).localeCompare(b[key]);
    });
    if (sortedTokens[0].id === tokens[0].id) {
      sortedTokens.reverse();
    }
    setTokens(sortedTokens);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === Math.ceil(tokens.length / pageSize) + 1) {
      loadTokens(page - 1).then((r) => { });
    }
  };

  const rowSelection = {
    onSelect: (record, selected) => { },
    onSelectAll: (selected, selectedRows) => { },
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedKeys(selectedRows);
    },
  };

  const handleRow = (record, index) => {
    if (record.status !== 1) {
      return {
        style: {
          background: 'var(--semi-color-disabled-border)',
        },
      };
    } else {
      return {};
    }
  };

  const description = "Add Tokens to start tracking Calls <br /> Distribution Metrics.";

  const addToken = () => {
    setEditingToken({
      id: undefined,
    });
    setShowEdit(true);
  }
  const [userDropdown, setUserDropdown] = useState(false);
  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdown(!userDropdown);
  };



  const [isChecked, setIsChecked] = useState(true);
  const [updateShow, setUpdateShow] = useState(false);
  const handleUpdateClose = () => setUpdateShow(false);
  const handleChange = () => {
    setIsChecked(!isChecked);
  };



  const [currentPage, setCurrentPage] = useState(0);
  const [pageToSize, setPageToSize] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, pageToSize]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await API.get(`/api/token/?p=${currentPage}&size=${pageToSize}`);
      setTokenList(response.data.data);
      setIsLastPage(response.data.data.length < pageToSize);
      setTotalItems(((page + 1) - 1) * pageToSize + response.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const startItem = ((currentPage + 1) - 1) * pageToSize + 1;
  const endItem = startItem + tokenList.length - 1;

  const totalPages = Math.ceil(totalItems / pageToSize);

  const maxPageButtons = 50; // Max visible page buttons
  let startPage = Math.max(1, (currentPage + 1) - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // Ensure 5 pages are shown when possible
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  // Create an array of visible page numbers
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  const getStoredChats = () => {
    let chats = localStorage.getItem('chats');
    let chatLink = localStorage.getItem('chat_link');
    let mjLink = localStorage.getItem('chat_link2');
    let chatsArray = [];
    let shouldUseCustom = true;

    if (chatLink) {
      shouldUseCustom = false;
      chatLink += `/#/?settings={"key":"{key}","url":"{address}"}`;
      chatsArray.push({
        node: 'item',
        key: 'default',
        name: 'ChatGPT Next Web',
        link: chatLink,
      });
    }

    if (mjLink) {
      shouldUseCustom = false;
      mjLink += `/#/?settings={"key":"{key}","url":"{address}"}`;
      chatsArray.push({
        node: 'item',
        key: 'mj',
        name: 'ChatGPT Next Midjourney',
        link: mjLink,
      });
    }

    if (shouldUseCustom) {
      try {
        chats = JSON.parse(chats);
        if (Array.isArray(chats)) {
          chats.forEach((chatObj, index) => {
            for (let key in chatObj) {
              if (chatObj.hasOwnProperty(key)) {
                chatsArray.push({
                  node: 'item',
                  key: index,
                  name: key,
                  link: chatObj[key],
                });
              }
            }
          });
        }
      } catch (e) {
        console.error('Error parsing chats:', e);
      }
    }

    return chatsArray;
  };
  const chatMessage = getStoredChats();


  return (
    <>
      <EditToken
        refresh={refresh}
        editingToken={editingToken}
        visiable={showEdit}
        handleClose={closeEdit}
      ></EditToken>

      {/* <ModalToken refresh={refresh} visiable={showEdit} editingToken={editingToken} updateShow={updateShow} handleUpdateClose={handleUpdateClose} /> */}

      {/* <div className="container">
        <div className='row'>
          <div className='col-md-4'>
            <div className='firstBox'>
              <div className='cardHeader'>
                <div className='cardIcon'>
                  <img src={codeIcon} alt="codeIcon" />
                </div>
                <div className='cardTime'>
                  <div
                    className="icon-container"
                    ref={userRef}
                    onClick={toggleUserDropdown}
                  >
                    <div className="user-icon">
                      This Week <IconChevronDown />
                    </div>
                    {userDropdown && (
                      <div className="dropdown active">
                        <div className="dropdown-item">This Week</div>
                        <div className="dropdown-item">This Month</div>
                        <div className="dropdown-item">This Year</div>
                      </div>)}
                  </div>
                </div>
              </div>
              <div className='cardContent'>
                <div>
                  <h6>All Tokens</h6>
                  <p>0</p>
                </div>
                <div>
                  <h6>Active</h6>
                  <p>0 <span>+0.00%</span> </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='firstBox'>
              <div className='cardHeader'>
                <div className='cardIcon'>
                  <img src={trendingIcon} alt="trendingIcon" />
                </div>
                <div className='cardTime'>
                  <div
                    className="icon-container"
                    ref={userRef}
                    onClick={toggleUserDropdown}
                  >
                    <div className="user-icon">
                      This Week <IconChevronDown />
                    </div>
                    {userDropdown && (
                      <div className="dropdown active">
                        <div className="dropdown-item">This Week</div>
                        <div className="dropdown-item">This Month</div>
                        <div className="dropdown-item">This Year</div>
                      </div>)}
                  </div>
                </div>
              </div>
              <div className='cardContent'>
                <div>
                  <h6>All Tokens</h6>
                  <p>0</p>
                </div>
                <div>
                  <h6>Success</h6>
                  <p>10.2k</p>
                </div>
                <div>
                  <h6>Active</h6>
                  <p>0 <span>+0.00%</span> </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='firstBox'>
              <div className='cardHeader'>
                <div className='cardIcon'>
                  <img src={summaryIcon} alt="summaryIcon" />
                </div>
                <div className='cardTime'>
                  <div
                    className="icon-container"
                    ref={userRef}
                    onClick={toggleUserDropdown}
                  >
                    <div className="user-icon">
                      This Week <IconChevronDown />
                    </div>
                    {userDropdown && (
                      <div className="dropdown active">
                        <div className="dropdown-item">This Week</div>
                        <div className="dropdown-item">This Month</div>
                        <div className="dropdown-item">This Year</div>
                      </div>)}
                  </div>
                </div>
              </div>
              <div className='cardContent'>
                <div>
                  <h6>All Tokens</h6>
                  <p>0</p>
                </div>
                <div>
                  <h6>Active</h6>
                  <p>0 <span>+0.00%</span> </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className='searchAdd'>
        <div className='searchBox'>
          <div className="search-container">
            <i className="search-icon"><IconSearch /></i>
            <input type="text" className="search-input" placeholder={t('令牌名称')} value={searchKeyword} onChange={handleKeywordChange} />
          </div>
          <button className='searchBtn' onClick={searchTokens} style={{ marginLeft: '10px' }}>
            {t('查询')}
          </button>
        </div>
        <button className='searchBtn'
          theme='light'
          type='primary'
          style={{ marginRight: 8 }}
          onClick={() => {
            setEditingToken({
              id: undefined,
            });
            setShowEdit(true);
            setUpdateShow(true);
          }}
        >
          <IconPlus /> {t('添加令牌')}
        </button>
      </div>

      {/* <NoData description={description} btnFunction={addToken} /> */}
      <div className='tableBox'>
        <Table borderless hover>
          <thead>
            <tr>
              <th>Token name <SortIconSvg color="--semi-table-thead-0" /></th>
              <th>Status <SortIconSvg color="--semi-table-thead-0" /></th>
              <th>Quota used <SortIconSvg color="--semi-table-thead-0" /></th>
              <th>Quota Bal <SortIconSvg color="--semi-table-thead-0" /></th>
              <th>Created <SortIconSvg color="--semi-table-thead-0" /></th>
              <th>Expiration <SortIconSvg color="--semi-table-thead-0" /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokenList && tokenList.map((data) => <tr>
              <td>{data.name}</td>
              <td>{renderStatus(data.status, data.model_limits_enabled)}
                {renderGroup(data.group)}</td>
              <td>{renderQuota(parseInt(data.used_quota))}</td>
              <td>{renderQuota(parseInt(data.remain_quota))}</td>
              <td>{formatDate(data.created_time)}</td>
              <td>{data.expired_time === -1 ? t('永不过期') : formatDate(data.expired_time)}</td>
              <td className='tableActions'>
                <button onClick={async (text) => { await copyText('sk-' + data.key); }}><img src={copyIcon} alt="tableAction" /></button>
                <button onClick={() => onOpenLink('default', chatMessage[0].link, data)}><img src={chatIcon} alt="tableAction" /> </button>
                <button onClick={() => { setEditingToken(data); setShowEdit(true); }}><img src={editIcon} alt="tableAction" /></button>
                {data.status === 1 ? <button onClick={async () => { manageToken(data.id, 'disable', data); }}><img src={disableIcon} alt="tableAction" /></button> : <button onClick={async () => { manageToken(data.id, 'enable', data); }}><img src={enableIcon} alt="tableAction" /></button>}
                <Popconfirm
                  title={t('确定是否要删除此令牌？')}
                  content={t('此修改将不可逆')}
                  okType={'danger'}
                  position={'left'}
                  onConfirm={() => {
                    manageToken(data.id, 'delete', data).then(() => {
                      removeRecord(data.key);
                    });
                  }}
                >
                  <button><img src={deleteIcon} alt="tableAction" /></button>
                </Popconfirm>

              </td>
            </tr>)}
          </tbody>
        </Table>
      </div>
      {  /* Pagination */}
      <TablePagination pageToSize={pageToSize} setPageToSize={setPageToSize} setCurrentPage={setCurrentPage} startItem={startItem} endItem={endItem} currentPage={currentPage} pageNumbers={pageNumbers} isLastPage={isLastPage} />
    </>
  );
};

export default TokensTable;
