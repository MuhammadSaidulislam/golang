import React, { useContext, useEffect, useRef, useMemo, useState } from 'react';
import { API, copy, showError, showInfo, showSuccess } from '../helpers';
import { useTranslation } from 'react-i18next';

import "./PriceTable.css"
import {
  Banner,
  Input,
  Layout,
  Modal,
  Space,
  Tag,
  Tooltip,
  Popover,
  ImagePreview,
  Button,
} from '@douyinfe/semi-ui';
import {
  IconMore,
  IconVerify,
  IconUploadError,
  IconHelpCircle,
  IconFilter,
  IconSort,
  IconChevronLeft,
  IconChevronRight,
} from '@douyinfe/semi-icons';
import { UserContext } from '../context/User/index.js';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { Dropdown, Table } from "react-bootstrap";
import checkMark from "../assets/checkTable.svg";
import sortIcon from "../assets/sort.svg";
import TablePagination from './TablePagination.js';
import { SortIconSvg } from './svgIcon';
import NoData from './NoData.js';


const ModelPricing = () => {
  const { t } = useTranslation();
  const [filteredValue, setFilteredValue] = useState([]);
  const compositionRef = useRef({ isComposition: false });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [isModalOpenurl, setIsModalOpenurl] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('default');

  const rowSelection = useMemo(
    () => ({
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
      },
    }),
    []
  );

  const handleChange = (value) => {
    if (compositionRef.current.isComposition) {
      return;
    }
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };
  const handleCompositionStart = () => {
    compositionRef.current.isComposition = true;
  };

  const handleCompositionEnd = (event) => {
    compositionRef.current.isComposition = false;
    const value = event.target.value;
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };

  function renderQuotaType(type) {
    // Ensure all cases are string literals by adding quotes.
    switch (type) {
      case 1:
        return (
          <Tag color='teal' size='large'>
            {t('按次计费')}
          </Tag>
        );
      case 0:
        return (
          <Tag color='violet' size='large'>
            {t('按量计费')}
          </Tag>
        );
      default:
        return t('未知');
    }
  }

  function renderAvailable(available) {
    return (
      <Popover
        content={
          <div style={{ padding: 8 }}>{t('您的分组可以使用该模型')}</div>
        }
        position='top'
        key={available}
        style={{
          backgroundColor: 'rgba(var(--semi-blue-4),1)',
          borderColor: 'rgba(var(--semi-blue-4),1)',
          color: 'var(--semi-color-white)',
          borderWidth: 1,
          borderStyle: 'solid',
        }}
      >
        <IconVerify style={{ color: 'green' }} size="large" />
      </Popover>
    )
  }

  const columns = [
    {
      title: t('可用性'),
      dataIndex: 'available',
      render: (text, record, index) => {
        // if record.enable_groups contains selectedGroup, then available is true
        return renderAvailable(record.enable_groups.includes(selectedGroup));
      },
      sorter: (a, b) => a.available - b.available,
    },
    {
      title: t('模型名称'),
      dataIndex: 'model_name',
      render: (text, record, index) => {
        return (
          <>
            <Tag
              color='green'
              size='large'
              onClick={() => {
                copyText(text);
              }}
            >
              {text}
            </Tag>
          </>
        );
      },
      onFilter: (value, record) =>
        record.model_name.toLowerCase().includes(value.toLowerCase()),
      filteredValue,
    },
    {
      title: t('计费类型'),
      dataIndex: 'quota_type',
      render: (text, record, index) => {
        return renderQuotaType(parseInt(text));
      },
      sorter: (a, b) => a.quota_type - b.quota_type,
    },
    {
      title: t('可用分组'),
      dataIndex: 'enable_groups',
      render: (text, record, index) => {

        // enable_groups is a string array
        return (
          <Space>
            {text.map((group) => {
              if (usableGroup[group]) {
                if (group === selectedGroup) {
                  return (
                    <Tag
                      color='blue'
                      size='large'
                      prefixIcon={<IconVerify />}
                    >
                      {group}
                    </Tag>
                  );
                } else {
                  return (
                    <Tag
                      color='blue'
                      size='large'
                      onClick={() => {
                        setSelectedGroup(group);
                        showInfo(t('当前查看的分组为：{{group}}，倍率为：{{ratio}}', {
                          group: group,
                          ratio: groupRatio[group]
                        }));
                      }}
                    >
                      {group}
                    </Tag>
                  );
                }
              }
            })}
          </Space>
        );
      },
    },
    {
      title: () => (
        <span style={{ 'display': 'flex', 'alignItems': 'center' }}>
          {t('倍率')}
          <Popover
            content={
              <div style={{ padding: 8 }}>
                {t('倍率是为了方便换算不同价格的模型')}<br />
                {t('点击查看倍率说明')}
              </div>
            }
            position='top'
            style={{
              backgroundColor: 'rgba(var(--semi-blue-4),1)',
              borderColor: 'rgba(var(--semi-blue-4),1)',
              color: 'var(--semi-color-white)',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <IconHelpCircle
              onClick={() => {
                setModalImageUrl('/ratio.png');
                setIsModalOpenurl(true);
              }}
            />
          </Popover>
        </span>
      ),
      dataIndex: 'model_ratio',
      render: (text, record, index) => {
        let content = text;
        let completionRatio = parseFloat(record.completion_ratio.toFixed(3));
        content = (
          <>
            <Text>{t('模型倍率')}：{record.quota_type === 0 ? text : t('无')}</Text>
            <br />
            <Text>{t('补全倍率')}：{record.quota_type === 0 ? completionRatio : t('无')}</Text>
            <br />
            <Text>{t('分组倍率')}：{groupRatio[selectedGroup]}</Text>
          </>
        );
        return <div>{content}</div>;
      },
    },
    {
      title: t('模型价格'),
      dataIndex: 'model_price',
      render: (text, record, index) => {
        let content = text;
        if (record.quota_type === 0) {
          // 这里的 *2 是因为 1倍率=0.002刀，请勿删除
          let inputRatioPrice = record.model_ratio * 2 * groupRatio[selectedGroup];
          let completionRatioPrice =
            record.model_ratio *
            record.completion_ratio * 2 *
            groupRatio[selectedGroup];
          content = (
            <>
              <Text>{t('提示')} ${inputRatioPrice} / 1M tokens</Text>
              <br />
              <Text>{t('补全')} ${completionRatioPrice} / 1M tokens</Text>
            </>
          );
        } else {
          let price = parseFloat(text) * groupRatio[selectedGroup];
          content = <>${t('模型价格')}：${price}</>;
        }
        return <div>{content}</div>;
      },
    },
  ];
  const [priceList, setPriceList] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userState, userDispatch] = useContext(UserContext);
  const [groupRatio, setGroupRatio] = useState({});
  const [usableGroup, setUsableGroup] = useState({});

  const setModelsFormat = (models, groupRatio) => {
    for (let i = 0; i < models.length; i++) {
      models[i].key = models[i].model_name;
      models[i].group_ratio = groupRatio[models[i].model_name];
    }
    // sort by quota_type
    models.sort((a, b) => {
      return a.quota_type - b.quota_type;
    });

    // sort by model_name, start with gpt is max, other use localeCompare
    models.sort((a, b) => {
      if (a.model_name.startsWith('gpt') && !b.model_name.startsWith('gpt')) {
        return -1;
      } else if (
        !a.model_name.startsWith('gpt') &&
        b.model_name.startsWith('gpt')
      ) {
        return 1;
      } else {
        return a.model_name.localeCompare(b.model_name);
      }
    });

    setModels(models);
  };

  const loadPricing = async () => {
    setLoading(true);
    let url = '';
    url = `/api/pricing`;
    const res = await API.get(url);
    const { success, message, data, group_ratio, usable_group } = res.data;
    if (success) {
      setPriceList(res.data.data)
      setGroupRatio(group_ratio);
      setUsableGroup(usable_group);
      setSelectedGroup(userState.user ? userState.user.group : 'default')
      setModelsFormat(data, group_ratio);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const refresh = async () => {
    await loadPricing();
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('已复制：' + text);
    } else {
      // setSearchKeyword(text);
      Modal.error({ title: '无法复制到剪贴板，请手动复制', content: text });
    }
  };

  useEffect(() => {
    refresh().then();
  }, []);


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Calculate paginated items
  const totalItems = priceList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedList = priceList.slice(startIndex, endIndex);


  return (
    <>
      <Layout>
        {priceList && priceList.length === 0 ? <section className='priceTable'>

          <div className='container'>
            <div className='row'>
              <div className='col-md-12 priceHeading mb-5'>
                <h1>{t('价格')}</h1>
                <p>{t('一个 API 解决您的所有问题。 - DuckLLM')}</p>
              </div>
              <div className='col-md-12 priceTableList mb-5'>
                <NoData />
              </div>
            </div>
          </div>


        </section> :
          <section className='priceTable'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12 priceHeading mb-5'>
                  <h1>{t('价格')}</h1>
                  <p>{t('一个 API 解决您的所有问题。 - DuckLLM')}</p>
                </div>
                <div className='col-md-12 priceTableList mb-5'>
                  <div className='tablePrice priceListTable'>
                    <Table responsive borderless hover>
                      <thead>
                        <tr>
                          <th></th>
                          <th>{t('模型')}</th>
                          <th>{t('计费类型')}</th>
                          <th>{t('可用分组')}</th>
                          <th>{t('模型价格')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedList && paginatedList.map((data) => <tr>
                          <td><img src={checkMark} alt="check" /></td>
                          <td><span className='greenMark'>{data.model_name}</span></td>
                          <td><span className='redMark'>pay-as-you-go</span></td>
                          <td>{data.enable_groups.map((group, index) => (
                            <span key={index} className='blueMark'>{group}</span>
                          ))}</td>
                          <td> {(() => {
                            const ratio = groupRatio[selectedGroup];
                            const isQuotaTypeZero = data.quota_type === 0;

                            if (isQuotaTypeZero) {
                              const inputRatioPrice = data.model_ratio * 2 * ratio;
                              const completionRatioPrice = data.model_ratio * data.completion_ratio * 2 * ratio;

                              return (
                                <>
                                  <Text>{t('提示')} ${inputRatioPrice.toFixed(4)} / 1M tokens</Text>
                                  <br />
                                  <Text>{t('补全')} ${completionRatioPrice.toFixed(4)} / 1M tokens</Text>
                                </>
                              );
                            } else {
                              const price = parseFloat(data.price || 0) * ratio;
                              return <Text>{t('模型价格')} ${price.toFixed(4)}</Text>;
                            }
                          })()}</td>
                        </tr>)}
                      </tbody>
                    </Table>
                  </div>
                  <div className="tablePagination">
                    <div className="leftItems">
                      {/* Items per page dropdown */}
                      <Dropdown className="bulkDropdown">
                        <Dropdown.Toggle id="dropdown-basic">{itemsPerPage}</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {[10, 20, 30, 50, 100].map((size) => (
                            <Dropdown.Item key={size} onClick={() => { setItemsPerPage(size); setCurrentPage(1); }}>
                              {size}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      <p className="itemNumber">
                        {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                      </p>
                    </div>

                    <div className="leftItems">

                      <Dropdown className="bulkDropdown pcPagPrice">
                        <Dropdown.Toggle id="dropdown-basic">{currentPage}</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {[...Array(totalPages)].map((_, index) => (
                            <Dropdown.Item key={index + 1} onClick={() => setCurrentPage(index + 1)}>
                              {index + 1}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>


                      {/* Prev & Next buttons */}
                      <button className="pagArrow" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <IconChevronLeft />
                      </button>
                      {/* Page number dropdown */}
                      <div className='mobilePagPrice'>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            onClick={() => setCurrentPage(index + 1)}
                            key={index + 1}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                      <button className="pagArrow" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        <IconChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>}
      </Layout>
    </>
  );
};

export default ModelPricing;
