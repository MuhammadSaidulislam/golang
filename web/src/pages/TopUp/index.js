import React, { useEffect, useState, userRef } from 'react';
import { API, getTodayStartTimestamp, isAdmin, isMobile, showError, showInfo, showSuccess, timestamp2string } from '../../helpers';
import {
  formatDate,
  renderNumber,
  renderQuota,
  renderQuotaWithAmount,
  stringToColor,
} from '../../helpers/render';
import {
  Col,
  Layout,
  Row,
  Typography,
  Card,
  Button,
  Form,
  Divider,
  Space,
  Toast,
  Avatar,
  Tag
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import CryptoModel from './cryptomodel';
import AirwallexModel from './airwallexmodel';
import sortIcon from "../../assets/sort.svg";

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from './../../components/DashboardLayout';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconClose, IconPlus, IconSearch } from '@douyinfe/semi-icons';
import walletIcon from "../../assets/wallet-add-white.svg";
import { Modal, Table, Dropdown } from 'react-bootstrap';
import weChatLogo from "../../assets/wechat.svg";
import aliPayLogo from "../../assets/alipay.svg";
import walletOneLogo from "../../assets/wallet (1).svg";
import walletTwoLogo from "../../assets/wallet (2).svg";
import walletThreeLogo from "../../assets/wallet (3).svg";
import giftLogo from "../../assets/fi_gift.svg";
import walletLight from "../../assets/wallet-add-white.svg";
import filterIcon from "../../assets/fi_filter.svg";
import downloadIcon from "../../assets/fi_download.svg";
import { SortIconSvg } from '../../components/svgIcon';
import { ITEMS_PER_PAGE } from '../../constants';
import { getLogOther } from '../../helpers/other';
import NoData from '../../components/NoData';
import Paragraph from '@douyinfe/semi-ui/lib/es/typography/paragraph';
const colors = [
  'amber',
  'blue',
  'cyan',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
];
const TopUp = () => {
  const { t } = useTranslation();
  let now = new Date();
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpCode, setTopUpCode] = useState('');
  const [topUpCount, setTopUpCount] = useState(0);
  const [minTopupCount, setMinTopUpCount] = useState(1);
  const [amount, setAmount] = useState(0.0);
  const [minTopUp, setMinTopUp] = useState(1);
  const [topUpLink, setTopUpLink] = useState('');
  const [enableOnlineTopUp, setEnableOnlineTopUp] = useState(false);
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCrypto, setOpenCrypto] = useState(false);
  const [openAirwallex, setOpenAirwallex] = useState(false);
  const [payWay, setPayWay] = useState('');
  const [enabledCryptomus, setEnabledCryptomus] = useState(false);
  const [enabledAirwallex, setEnabledAirwallex] = useState(false);

  const isAdminUser = isAdmin();
  const [paymentShow, setPaymentShow] = useState(false);
  const handleUpdateClose = () => {
    setPaymentShow(false);
  }
  const [activePage, setActivePage] = useState(1);
  const [logCount, setLogCount] = useState(ITEMS_PER_PAGE);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [logType, setLogType] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageToSize, setPageToSize] = useState(10);
  const [sizeArray, setSizeArray] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [itemRange, setItemRange] = useState('');
  const [walletLogs, setWalletLogs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Month is 0-indexed
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  function renderType(type) {
    switch (type) {
      case 1:
        return <Tag color='cyan' size='large'>{t('充值')}</Tag>;
      case 2:
        return <Tag color='lime' size='large'>{t('消费')}</Tag>;
      case 3:
        return <Tag color='orange' size='large'>{t('管理')}</Tag>;
      case 4:
        return <Tag color='purple' size='large'>{t('系统')}</Tag>;
      default:
        return <Tag color='black' size='large'>{t('未知')}</Tag>;
    }
  }

  function renderUseTime(type) {
    const time = parseInt(type);
    if (time < 101) {
      return (
        <Tag color='green' size='large'>
          {' '}
          {time} s{' '}
        </Tag>
      );
    } else if (time < 300) {
      return (
        <Tag color='orange' size='large'>
          {' '}
          {time} s{' '}
        </Tag>
      );
    } else {
      return (
        <Tag color='red' size='large'>
          {' '}
          {time} s{' '}
        </Tag>
      );
    }
  }

  function renderIsStream(bool) {
    if (bool) {
      return <Tag color='blue' size='large'>{t('流')}</Tag>;
    } else {
      return <Tag color='purple' size='large'>{t('非流')}</Tag>;
    }
  }

  function renderFirstUseTime(type) {
    let time = parseFloat(type) / 1000.0;
    time = time.toFixed(1);
    if (time < 3) {
      return (
        <Tag color='green' size='large'>
          {' '}
          {time} s{' '}
        </Tag>
      );
    } else if (time < 10) {
      return (
        <Tag color='orange' size='large'>
          {' '}
          {time} s{' '}
        </Tag>
      );
    } else {
      return (
        <Tag color='red' size='large'>
          {' '}
          {time} s{' '}
        </Tag>
      );
    }
  }

  const topUp = async () => {
    if (redemptionCode === '') {
      showInfo(t('请输入兑换码！'));
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: redemptionCode,
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess(t('兑换成功！'));
        // Modal.success({
        //   title: t('兑换成功！'),
        //   content: t('成功兑换额度：') + renderQuota(data),
        //   centered: true,
        // });
        setUserQuota((quota) => {
          return quota + data;
        });
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError(t('请求失败'));
    } finally {
      setIsSubmitting(false);
      setPaymentShow(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showError(t('超级管理员未设置充值链接！'));
      return;
    }
    window.open(topUpLink, '_blank');
  };

  const preTopUp = async (payment) => {

    if (!enableOnlineTopUp) {
      showError(t('管理员未开启在线充值！'));
      return;
    }
    await getAmount();
    if (topUpCount < minTopUp) {
      showError(t('充值数量不能小于') + minTopUp);
      return;
    }
    setPayWay(payment);
    setOpen(true);
    setPaymentShow(false);
  };

  const topUpCrypto = async () => {
    setOpenCrypto(true);
    setPaymentShow(false);
  };

  const topUpAirwallex = async () => {
    setOpenAirwallex(true);
    setPaymentShow(false);
  };

  const getOptions = async () => {
    try {
      const res = await API.get('/api/option/');
      const { success, message, data } = res.data;
      if (success) {
        // Set the values based on the response
        let newInputs = {};
        data.forEach((item) => {
          if (item.key === 'EnabledCryptomus' || item.key === 'EnabledAirwallex') {
            newInputs[item.key] = item.value === 'true'; // true if 'true', false if 'false'
          }
        });

        setEnabledCryptomus(newInputs.EnabledCryptomus || false); // Default to false if not found
        setEnabledAirwallex(newInputs.EnabledAirwallex || false); // Default to false if not found
      } else {
        showError(message);
      }
    } catch (err) {
      showError('Error fetching options');
    }
  };

  const onlineTopUp = async () => {
    if (amount === 0) {
      await getAmount();
    }
    if (topUpCount < minTopUp) {
      showError('充值数量不能小于' + minTopUp);
      return;
    }
    setOpen(false);
    try {
      const res = await API.post('/api/user/pay', {
        amount: parseInt(topUpCount),
        top_up_code: topUpCode,
        payment_method: payWay,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        // showInfo(message);
        if (message === 'success') {
          let params = data;
          let url = res.data.url;
          let form = document.createElement('form');
          form.action = url;
          form.method = 'POST';
          // 判断是否为safari浏览器
          let isSafari =
            navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') < 1;
          if (!isSafari) {
            form.target = '_blank';
          }
          for (let key in params) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          showError(data);
          // setTopUpCount(parseInt(res.data.count));
          // setAmount(parseInt(data));
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setUserQuota(data.quota);
    } else {
      showError(message);
    }
  };

  // recharge amount list

  const setLogsFormat = (logs) => {
    let expandDatesLocal = {};
    for (let i = 0; i < logs.length; i++) {
      logs[i].timestamp2string = timestamp2string(logs[i].created_at);
      logs[i].key = logs[i].id;
      let other = getLogOther(logs[i].other);
      let expandDataLocal = [];
      if (isAdmin()) {
        // let content = '渠道：' + logs[i].channel;
        // if (other.admin_info !== undefined) {
        //   if (
        //     other.admin_info.use_channel !== null &&
        //     other.admin_info.use_channel !== undefined &&
        //     other.admin_info.use_channel !== ''
        //   ) {
        //     // channel id array
        //     let useChannel = other.admin_info.use_channel;
        //     let useChannelStr = useChannel.join('->');
        //     content = `渠道：${useChannelStr}`;
        //   }
        // }
        // expandDataLocal.push({
        //   key: '渠道重试',
        //   value: content,
        // })
      }
      if (other?.ws || other?.audio) {
        expandDataLocal.push({
          key: t('语音输入'),
          value: other.audio_input,
        });
        expandDataLocal.push({
          key: t('语音输出'),
          value: other.audio_output,
        });
        expandDataLocal.push({
          key: t('文字输入'),
          value: other.text_input,
        });
        expandDataLocal.push({
          key: t('文字输出'),
          value: other.text_output,
        });
      }
      expandDataLocal.push({
        key: t('日志详情'),
        value: logs[i].content,
      });
      expandDatesLocal[logs[i].key] = expandDataLocal;
    }

    //  setExpandData(expandDatesLocal);

    setWalletLogs(logs);
  };

  const handleDateChange = async (value) => {
    if (['week', 'month', 'year'].includes(value)) {
      let now = new Date();
      let start, end;

      switch (value) {
        case 'week':
          // Get the start (Sunday) and end (Saturday) of the current week
          start = new Date(now);
          start.setDate(now.getDate() - now.getDay());
          start.setHours(0, 0, 0, 0);

          end = new Date(start);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;

        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;

        case 'year':
          start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
      }

      let url = '';
      let localStartTimestamp = Date.parse(formatDateTime(start)) / 1000;
      let localEndTimestamp = Date.parse(formatDateTime(end)) / 1000;
      if (isAdminUser) {
        url = `/api/log/?p=${activePage}&page_size=${pageSize}&type=${logType}&username=&token_name=${searchKeyword}&model_name=&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&channel=&group=`;
      } else {
        url = `/api/log/self/?p=${activePage}&page_size=${pageSize}&type=${logType}&token_name=${searchKeyword}&model_name=&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&group=`;
      }
      url = encodeURI(url);
      const res = await API.get(url);
      const { success, message, data } = res.data;
      if (success) {
        const newPageData = data.items;
        setActivePage(data.page);
        setPageSize(data.page_size);
        setLogCount(data.total);
        setLogsFormat(newPageData);
        // data range 
        const startItem = (activePage - 1) * pageSize + 1;
        const endItem = Math.min(activePage * pageSize, data.total);
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
    }
  };

  const loadLogs = async (startIdx, pageSize, logType = 1) => {
    //  setLoading(true);

    let url = '';
    let localStartTimestamp = Date.parse(timestamp2string(getTodayStartTimestamp())) / 1000;
    let localEndTimestamp = Date.parse(timestamp2string(now.getTime() / 1000 + 3600)) / 1000;
    if (isAdminUser) {
      url = `/api/log/?p=${startIdx}&page_size=${pageSize}&type=${logType}&username=&token_name=${searchKeyword}&model_name=&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&channel=&group=`;
    } else {
      url = `/api/log/self/?p=${startIdx}&page_size=${pageSize}&type=${logType}&token_name=${searchKeyword}&model_name=&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&group=`;
    }
    url = encodeURI(url);
    const res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      const newPageData = data.items;
      setActivePage(data.page);
      setPageSize(data.page_size);
      setLogCount(data.total);
      setLogsFormat(newPageData);
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
    // setLoading(false);
  };

  useEffect(() => {
    //  getOptions();
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.top_up_link) {
        setTopUpLink(status.top_up_link);
      }
      if (status.min_topup) {
        setMinTopUp(status.min_topup);
      }
      if (status.enable_online_topup) {
        setEnableOnlineTopUp(status.enable_online_topup);
      }
    }
    getUserQuota().then();

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      //  await getLogSelfStat();
      await loadLogs(activePage, pageSize, logType);
      //  await getLogStat();
      // if (isAdminUser) {
      //   await getLogSelfStat();
      //   await getLogStat();
      // } else {
      //   await getLogSelfStat();
      // }
    };

    fetchData();
  }, []);


  const renderAmount = () => {
    // console.log(amount);
    return amount + ' ' + t('元');
  };

  const getAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    try {
      const res = await API.post('/api/user/amount', {
        amount: parseFloat(value),
        top_up_code: topUpCode,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        // showInfo(message);
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
          // setTopUpCount(parseInt(res.data.count));
          // setAmount(parseInt(data));
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCrytoCancel = () => {
    setOpenCrypto(false);
  };
  const handleAirwallexCancel = () => {
    setOpenAirwallex(false);
  };

  const [userDropdown, setUserDropdown] = useState(false);

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdown(!userDropdown);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.target.value);
  };
  const refresh = async () => {
    setActivePage(1);
    await loadLogs(activePage, pageSize, logType);
  };
  return (
    <div>
      <DashboardLayout>
        <div className='cardList'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='wallet-card'>
                  <div className="curve-container">
                    <div className="curve-1"></div>
                    <div className="curve-2"></div>
                    <div className="curve-3"></div>
                    <div className="curve-4"></div>
                  </div>
                  <div className='cardHeader'>
                    <div className='cardHeading'>
                      Recharge Summary
                    </div>
                    <div className='cardTime'>
                      <button className='rechargeBtn' onClick={() => setPaymentShow(true)}> <img src={walletLight} alt="walletLight" /> Recharge</button>
                    </div>
                  </div>
                  <div className='cardContent'>
                    <div style={{ width: '50%' }}>
                      <h6>Current Bal</h6>
                      <p>$12,030.00</p>
                    </div>
                    <div style={{ width: '50%' }}>
                      <h6>Spent</h6>
                      <p>$20,390.00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='firstBox' style={{ minHeight: '145px' }}>
                  <div className='cardHeader'>
                    <div className='cardText'>
                      Recharge Summary
                    </div>
                    <div className='cardTime'>
                      <div
                        className="icon-container"
                        ref={userRef}
                        onClick={toggleUserDropdown}
                      >
                        <div className="user-icon">
                          {t('选择标签')} <IconChevronDown />
                        </div>
                        {userDropdown && (
                          <div className="dropdown active">
                            <div className="dropdown-item" onClick={() => handleDateChange("week")}>{t('本星期')}</div>
                            <div className="dropdown-item" onClick={() => handleDateChange("month")}>{t('本月')}</div>
                            <div className="dropdown-item" onClick={() => handleDateChange("year")}>{t('今年')}</div>
                          </div>)}
                      </div>
                    </div>
                  </div>
                  <div className='cardContent'>
                    <div style={{ width: '50%' }}>
                      <h6>Exchange Bal</h6>
                      <p>$42,090.50</p>
                    </div>
                    <div style={{ width: '50%' }}>
                      <h6>Total Recharge</h6>
                      <p>$42,090.50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='searchAdd'>
          <div className='searchBox'>
            <div className="search-container">
              <i className="search-icon"><IconSearch /></i>
              <input type="text" className="search-input" placeholder={t('令牌名称')} value={searchKeyword} onChange={handleKeywordChange} />
            </div>
            <button className='searchBtn' onClick={refresh} style={{ marginLeft: '10px' }}>
              {t('查询')}
            </button>
            {/* <div className='filterOption'>
              <button><img src={downloadIcon} alt="download" /></button>
            </div> */}
          </div>
          <div className='cardTime'>
            <button className='rechargeBtn' onClick={() => setPaymentShow(true)}> <img src={walletLight} alt="walletLight" /> Recharge</button>
          </div>
        </div>

        {/* Table list */}
        {walletLogs && walletLogs.length === 0 ? <NoData /> :
          <>
            <div className="tableData">
              <div className="tableBox">
                <Table borderless hover>
                  <thead>
                    <tr>
                      <th>{t('时间')}as</th>
                      {isAdmin() ? <th>{t('渠道')}</th> : ""}
                      {isAdmin() ? <th>{t('用户')}</th> : ""}
                      <th>{t('令牌')}</th>
                      <th>{t('分组')}</th>
                      <th>{t('类型')}</th>
                      <th>{t('模型')}</th>
                      <th>{t('用时/首字')}</th>
                      <th>{t('提示')}</th>
                      <th>{t('补全')}</th>
                      <th>{t('花费')}</th>
                      {isAdmin() ? <th>{t('重试')}</th> : ""}
                      <th>{t('详情')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletLogs && walletLogs.map((wallet, index) =>
                      <tr key={index}>
                        <td>{formatDate(wallet.created_at)}</td>
                        {isAdmin() ? <td>
                          {wallet.type === 0 || wallet.type === 2 ? <Tag color={colors[parseInt(wallet.channel) % colors.length]} size='large'>
                            {wallet.channel}
                          </Tag> : "Null"}
                        </td> : ""}
                        {isAdmin() ? <td><div>
                          <Avatar
                            size='small'
                            color={stringToColor(wallet.username)}
                            style={{ marginRight: 4 }}
                            onClick={(event) => {
                              event.stopPropagation();
                              showUserInfo(wallet.user_id)
                            }}
                          >
                            {typeof wallet.username === 'string' && wallet.username.slice(0, 1)}
                          </Avatar>
                          {wallet.username}
                        </div></td> : ""}
                        <td>{wallet.type === 0 || wallet.type === 2 ?
                          <Tag
                            color='grey'
                            size='large'
                            onClick={(event) => {
                              copyText(event, wallet.token_name);
                            }}
                          >
                            {t(wallet.token_name)}
                          </Tag> : "Null"}
                        </td>
                        <td>
                          {(() => {
                            if (wallet.type === 0 || wallet.type === 2) {
                              if (wallet.group) {
                                return renderGroup(wallet.group);
                              }
                              const other = wallet.other ? JSON.parse(wallet.other) : null;
                              if (other?.group !== undefined) {
                                return renderGroup(other.group);
                              }
                            }
                            return 'Null';
                          })()}
                        </td>
                        <td>{renderType(wallet)}</td>
                        <td>{wallet.type === 0 || wallet.type === 2 ? <Tag
                          color={stringToColor(wallet.model_name)}
                          size='large'
                          onClick={(event) => {
                            copyText(event, wallet.model_name);
                          }}
                        >
                          {wallet.model_name}
                        </Tag> : "Null"}</td>
                        <td>
                          {(() => {
                            const other = getLogOther(wallet.other);
                            return (
                              <Space>
                                {renderUseTime(wallet.use_time)}
                                {wallet.is_stream && renderFirstUseTime(other.frt)}
                                {renderIsStream(wallet.is_stream)}
                              </Space>
                            );
                          })()}
                        </td>
                        <td>
                          {wallet.type === 0 || wallet.type === 2 ? <span>{wallet.prompt_tokens}</span> : "Null"}
                        </td>
                        <td>
                          {wallet.type === 0 || wallet.type === 2 ? <span>{wallet.completion_tokens}</span> : "Null"}
                        </td>
                        <td>
                          {wallet.type === 0 || wallet.type === 2 ? renderQuota(wallet.quota, 6) : "Null"}
                        </td>
                        {isAdmin() ? <td>
                          {(() => {
                            let content = t('渠道') + `：${wallet.channel}`;

                            if (wallet.other !== '') {
                              try {
                                const other = JSON.parse(wallet.other);

                                if (other?.admin_info?.use_channel) {
                                  const useChannel = other.admin_info.use_channel;
                                  if (Array.isArray(useChannel) && useChannel.length > 0) {
                                    const useChannelStr = useChannel.join('->');
                                    content = t('渠道') + `：${useChannelStr}`;
                                  }
                                }
                              } catch (err) {
                                console.error("Invalid JSON in wallet.other:", err);
                              }
                            }

                            return isAdminUser ? <div>{content}</div> : null;
                          })()}
                        </td>
                          : ""}
                        <td>
                          {(() => {
                            const other = getLogOther(wallet.other);

                            if (other == null || wallet.type !== 2) {
                              return (
                                <Paragraph
                                  ellipsis={{
                                    rows: 2,
                                    showTooltip: {
                                      type: 'popover',
                                      opts: { style: { width: 240 } },
                                    },
                                  }}
                                  style={{ maxWidth: 240 }}
                                >
                                  {wallet.content}
                                </Paragraph>
                              );
                            }

                            const content = renderModelPriceSimple(
                              other.model_ratio,
                              other.model_price,
                              other.group_ratio
                            );

                            return (
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ maxWidth: 240 }}
                              >
                                {content}
                              </Paragraph>
                            );
                          })()}
                        </td>

                      </tr>
                    )}
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
          </>
        }


        <Layout.Content>
          {/* <Modal
            title={t('确定要充值吗')}
            visible={open}
            onOk={onlineTopUp}
            onCancel={handleCancel}
            maskClosable={false}
            size={'small'}
            centered={true}
          >
            <p>{t('充值数量')}：{topUpCount}</p>
            <p>{t('实付金额')}：{renderAmount()}</p>
            <p>{t('是否确认充值？')}</p>
          </Modal>
          <Modal
            title={"Cryptomus Payment"}
            visible={openCrypto}
            onOk={handleCrytoCancel}
            onCancel={handleCrytoCancel}
            maskClosable={false}
            size={'large'}
            centered={true}
          >
            <CryptoModel />
          </Modal>

          <Modal
            title={"Airwallex Payment"}
            visible={openAirwallex}
            onOk={handleAirwallexCancel}
            onCancel={handleAirwallexCancel}
            maskClosable={false}
            size={'large'}
            centered={true}
          >
            <AirwallexModel />
          </Modal> */}


          {/* <Space>


            {enabledCryptomus && (
              <Button
                style={{
                  backgroundColor: 'rgba(var(--semi-yellow-5), 1)',
                }}
                type={'primary'}
                theme={'solid'}
                onClick={async () => {
                  topUpCrypto();
                }}
              >
                Cryptomus
              </Button>
            )}
            {enabledAirwallex && (
              <Button
                style={{
                  backgroundColor: 'rgba(var(--semi-red-5), 1)',
                }}
                type={'primary'}
                theme={'solid'}
                onClick={async () => {
                  topUpAirwallex();
                }}
              >
                AirWallex
              </Button>
            )}
          </Space> */}

        </Layout.Content>




        {/* payment modal  */}
        <Modal show={paymentShow} onHide={handleUpdateClose} centered size="md">
          <div className='modalHeading'>
            <h1>{t('在线充值')}</h1>
            <button onClick={handleUpdateClose}><IconClose /></button>
          </div>
          <div className='modalContent walletModal'>
            <div className="recharge-details">Recharge details</div>
            <div className="recharge-form">
              <div className="recharge-amount">
                <p>{t('实付金额：') + ' ' + renderAmount()}</p>
                <div className="memberInput rate">
                  <span>$</span>
                  <input disabled={!enableOnlineTopUp} type="number" placeholder={t('充值数量，最低 ') + renderQuotaWithAmount(minTopUp)} name='redemptionCount' value={topUpCount} onChange={async (value) => {
                    if (value.target.value < 1) {
                      value = 1;
                    }
                    setTopUpCount(value.target.value);
                    await getAmount(value.target.value);
                  }} />
                </div>
              </div>

              <div className="payment-methods">
                <div className="payment-option" onClick={async () => { preTopUp('zfb'); }}>
                  <div className="payment-left">
                    <span>Pay</span>
                    <strong>¥100.00</strong>
                    <span>with</span>
                    <img src={aliPayLogo} alt="aliPayLogo" />
                  </div>
                  <div className="right-arrow"><IconChevronRight /></div>
                </div>

                <div className="payment-option" onClick={async () => { preTopUp('wx'); }}>
                  <div className="payment-left">
                    <span>Pay</span>
                    <strong>¥100.00</strong>
                    <span>with</span>
                    <img src={weChatLogo} alt="weChatLogo" />
                  </div>
                  <div className="right-arrow"><IconChevronRight /></div>
                </div>

                <div className="payment-option" onClick={topUpCrypto}>
                  <div className="payment-left">
                    <span>Pay</span>
                    <strong>¥100.00</strong>
                    <span>with</span>
                    <b>Debit/Credit Card</b>
                  </div>
                  <div className="right-arrow"><IconChevronRight /></div>
                </div>

                <div className="payment-option" onClick={topUpAirwallex}>
                  <div className="payment-left">
                    <span>Pay</span>
                    <strong>¥100.00</strong>
                    <span>with</span>
                    <b>Wallet</b>
                    <div className="wallet-container">
                      <img src={walletOneLogo} alt="weChatLogo" />
                      <img src={walletTwoLogo} alt="weChatLogo" />
                      <img src={walletThreeLogo} alt="weChatLogo" />
                    </div>
                  </div>
                  <div className="right-arrow"><IconChevronRight /></div>
                </div>
              </div>

              <div className="redeem-section">
                <div className="redeem-title">{t('兑换码')}</div>
                {topUpLink ? (
                  <div className="get-code-btn" onClick={openTopUpLink}>
                    <img src={giftLogo} alt="giftLogo" />
                    {t('获取兑换码')}
                  </div>
                ) : null}

              </div>

              <input type="text" className="redeem-input" placeholder={t('兑换码')} value={redemptionCode} onChange={(value) => {
                setRedemptionCode(value.target.value);
              }} />

              <div className="button-group">
                <div className="btn btn-cancel" onClick={handleUpdateClose}>Cancel</div>
                <div onClick={topUp} className="btn btn-redeem" disabled={isSubmitting}>{isSubmitting ? t('兑换中...') : t('兑换')}</div>
              </div>
            </div>
          </div>
        </Modal>

        {/* payment options modal   */}
        <Modal show={open} onHide={handleCancel} centered size="md">
          <div className='modalHeading'>
            <h1>{t('在线充值')}</h1>
            <button onClick={handleCancel}><IconClose /></button>
          </div>
          <div className='modalContent walletModal'>
            <p>{t('充值数量')}：{topUpCount}</p>
            <p>{t('实付金额')}：{renderAmount()}</p>
            <p>{t('是否确认充值？')}</p>
            <div className="button-group">
              <div className="btn btn-cancel" onClick={handleCancel}>Cancel</div>
              <div onClick={onlineTopUp} className="btn btn-redeem">{t('确定')}</div>
            </div>
          </div>
        </Modal>
        {/* crypto   */}
        <Modal show={openCrypto} onHide={handleCrytoCancel} centered size="md">
          <div className='modalHeading'>
            <h1>Cryptomus Payment</h1>
            <button onClick={handleCrytoCancel}><IconClose /></button>
          </div>
          <div className='modalContent walletModal'>
            <CryptoModel />
          </div>
        </Modal>

        {/* Airwallex   */}
        <Modal show={openAirwallex} onHide={handleAirwallexCancel} centered size="md">
          <div className='modalHeading'>
            <h1>Airwallex Payment</h1>
            <button onClick={handleAirwallexCancel}><IconClose /></button>
          </div>
          <div className='modalContent walletModal'>
            <AirwallexModel />
          </div>
        </Modal>


      </DashboardLayout>
    </div>
  );
};

export default TopUp;
