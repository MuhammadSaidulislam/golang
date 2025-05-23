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
  Popconfirm,
  Popover, Space,
  SplitButtonGroup,
  Tag,
} from '@douyinfe/semi-ui';
import { Modal, Dropdown, Table } from "react-bootstrap";
import Icon, { IconArrowDown, IconChevronDown, IconChevronLeft, IconChevronRight, IconClose, IconCode, IconCodeStroked, IconLanguage, IconPlus, IconSearch, IconTreeTriangleDown } from '@douyinfe/semi-icons';
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
import { CommentIconSvg, EditIconSvg, SortIconSvg } from './svgIcon';
import enableIcon from "../assets/fi_check.svg";
import { useLocation } from 'react-router-dom';



const TokensTable = () => {

  const { t } = useTranslation();
  const [tokenList, setTokenList] = useState([]);
  const renderStatus = (status, model_limits_enabled = false) => {
    switch (status) {
      case 1:
        if (model_limits_enabled) {
          return (
            <span style={{ color: 'green' }}>
              {t('已启用：限制模型')}
            </span>
          );
        } else {
          return (
            <span style={{ color: 'green' }}>
              {t('已启用')}
            </span>
          );
        }
      case 2:
        return (
          <span style={{ color: 'red' }}>
            {t('已禁用')}
          </span>
        );
      case 3:
        return (
          <span style={{ color: 'yellow' }}>
            {t('已过期')}
          </span>
        );
      case 4:
        return (
          <span style={{ color: 'grey' }}>
            {t('已耗尽')}
          </span>
        );
      default:
        return (
          <span style={{ color: 'black' }}>
            {t('未知状态')}
          </span>
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
  const location = useLocation();
  const [openWarning, setOpenWarning] = useState(false);
  const openModalClose = () => { setOpenWarning(false); };
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
  const [modalShow, setModalShow] = useState(false);
  const [chats, setChats] = useState([]);
  const [count, setCount] = useState(0);
  const [editingToken, setEditingToken] = useState({
    id: undefined,
  });
  const handleModalClose = () => {
    setModalShow(false);
  }

  const closeEdit = () => {
    setShowEdit(false);
    setTimeout(() => {
      setEditingToken({
        id: undefined,
      });
    }, 500);
  };

  useEffect(() => {
    if (location.state?.showDefaultPasswordWarning) {
      setOpenWarning(true);
    }
  }, [location.state]);

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
    setCount(count + 1);
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
  }, [currentPage, pageToSize, count]);

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
        modalShow={modalShow}
        handleModalClose={handleModalClose}
      ></EditToken>

      <Modal show={openWarning} onHide={openModalClose} centered size="md">
        <div className='modalHeading'>
          <h1>{t('您正在使用默认密码！')}</h1>
          <button onClick={openModalClose}><IconClose /></button>
        </div>
        <div className='modalContent walletModal adminModal'>
          <p>{t('请立刻修改默认密码！')}</p>
          <div className="button-group mt-3">
            <div className="btn btn-cancel" onClick={openModalClose}>{t('取消')}</div>
            <div onClick={openModalClose} className="btn btn-redeem">{t('确定')}</div>
          </div>
        </div>
      </Modal>

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
            setModalShow(true);
            setUpdateShow(true);
          }}
        >
          <IconPlus /> {t('添加令牌')}
        </button>
      </div>

      {/* <NoData description={description} btnFunction={addToken} /> */}
      <div className="tableData">
        <div className='tableBox'>
          <Table borderless hover>
            <thead>
              <tr>
                <th>{t('代币名称')}</th>
                <th>{t('任务状态')}</th>
                <th>{t('分组名称')}</th>
                <th>{t('已用额度')}</th>
                <th>{t('配额余额')}</th>
                <th>{t('已创建')}</th>
                <th>{t('到期日')}</th>
                <th>{t('操作')}</th>
              </tr>
            </thead>
            <tbody>
              {tokenList && tokenList.map((data) => <tr>
                <td>{data.name}</td>
                <td> {renderStatus(data.status, data.model_limits_enabled)}</td>
                <td>{data.group}</td>
                <td>{renderQuota(parseInt(data.used_quota))}</td>
                <td>{data.unlimited_quota ? (
                  <span>
                    {t('无限制')}
                  </span>
                ) : (
                  <span>
                    {renderQuota(parseInt(data.remain_quota))}
                  </span>
                )}</td>
                <td>{formatDate(data.created_time)}</td>
                <td>{data.expired_time === -1 ? t('永不过期') : formatDate(data.expired_time)}</td>
                <td className='tableActions'>
                  <button onClick={async (text) => { await copyText('sk-' + data.key); }}><img src={copyIcon} alt="tableAction" /></button>
                  <button onClick={() => onOpenLink('default', chatMessage[0].link, data)}><CommentIconSvg color="--semi-table-thead-0" /></button>
                  <button onClick={() => { setEditingToken(data); setModalShow(true); }}><EditIconSvg color="--semi-table-thead-0" /></button>
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
      </div>
      {  /* Pagination */}
      <TablePagination pageToSize={pageToSize} setPageToSize={setPageToSize} setCurrentPage={setCurrentPage} startItem={startItem} endItem={endItem} currentPage={currentPage} pageNumbers={pageNumbers} isLastPage={isLastPage} />
    </>
  );
};

export default TokensTable;
