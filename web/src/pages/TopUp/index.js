import React, { useEffect, useState, userRef } from 'react';
import { API, isMobile, showError, showInfo, showSuccess } from '../../helpers';
import {
  renderNumber,
  renderQuota,
  renderQuotaWithAmount,
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

const TopUp = () => {
  const { t } = useTranslation();
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpCode, setTopUpCode] = useState('');
  const [topUpCount, setTopUpCount] = useState(0);
  console.log('topUpCount', topUpCount);

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


  const [paymentShow, setPaymentShow] = useState(false);
  const handleUpdateClose = () => {
    setPaymentShow(false);
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
        Modal.success({
          title: t('兑换成功！'),
          content: t('成功兑换额度：') + renderQuota(data),
          centered: true,
        });
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
  };
  const topUpCrypto = async () => {
    setOpenCrypto(true);
  };

  const topUpAirwallex = async () => {
    setOpenAirwallex(true);
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

  useEffect(() => {
    getOptions();
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdown(!userDropdown);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.target.value);
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
            <button className='searchBtn' style={{ marginLeft: '10px' }}>
              {t('查询')}
            </button>
            <div className='filterOption'>
              <button><img src={filterIcon} alt="filter" /> Filter</button>
              <button><img src={downloadIcon} alt="download" /></button>

            </div>
          </div>
          <div className='cardTime'>
            <button className='rechargeBtn' onClick={() => setPaymentShow(true)}> <img src={walletLight} alt="walletLight" /> Recharge</button>
          </div>
        </div>

        {/* Table list */}
        <div className="tableBox">
          <Table borderless hover>
            <thead>
              <tr>
                <th>Submission Date/Time <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Spend time <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Type <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Task ID <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Schedule <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Result <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Prompt <SortIconSvg color="--semi-table-thead-0" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(50)].map((_, index) => (
                <tr key={index}>
                  <td>12 Aug 2022 - 12:25 am</td>
                  <td>5</td>
                  <td>My APIs</td>
                  <td>AA87</td>
                  <td>A25</td>
                  <td>12 Aug 2022 - 12:25 am</td>
                  <td>Action Prompt</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Table Pagination */}
        <div className='tablePagination'>
          <div className='leftItems'>
            <Dropdown className='bulkDropdown' style={{ borderRadius: '6px' }} onMouseDown={(e) => e.stopPropagation()}>
              <Dropdown.Toggle id="dropdown-basic" style={{ borderRadius: '6px' }}>
                1
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>1</Dropdown.Item>
                <Dropdown.Item>2</Dropdown.Item>
                <Dropdown.Item>3</Dropdown.Item>
                <Dropdown.Item>4</Dropdown.Item>
                <Dropdown.Item>5</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p className='item'>Items per page</p>
            <p className='itemNumber'>1-10 of 200 items</p>
          </div>
          <div className='leftItems'>
            <Dropdown className='bulkDropdown' style={{ borderRadius: '6px' }} onMouseDown={(e) => e.stopPropagation()}>
              <Dropdown.Toggle id="dropdown-basic" style={{ borderRadius: '6px' }}>
                1
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>1</Dropdown.Item>
                <Dropdown.Item>2</Dropdown.Item>
                <Dropdown.Item>3</Dropdown.Item>
                <Dropdown.Item>4</Dropdown.Item>
                <Dropdown.Item>5</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <p className='itemNumber'>1-10 of 200 items</p>
            <button className='pagArrow'> <IconChevronLeft /> </button>
            <button className='pagArrow'> <IconChevronRight /> </button>
          </div>
        </div>


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
            <h1>Create New Token</h1>
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

                <div className="payment-option">
                  <div className="payment-left">
                    <span>Pay</span>
                    <strong>¥100.00</strong>
                    <span>with</span>
                    <b>Debit/Credit Card</b>
                  </div>
                  <div className="right-arrow"><IconChevronRight /></div>
                </div>

                <div className="payment-option">
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
      </DashboardLayout>
    </div>
  );
};

export default TopUp;
