import React, { useEffect, useState } from 'react';
import {
  API,
  copy,
  showError,
  showSuccess,
  timestamp2string,
} from '../helpers';
import { SortIconSvg } from './svgIcon';
import { ITEMS_PER_PAGE } from '../constants';
import { renderQuota } from '../helpers/render';
import {
  Button, Divider,
  Form,
  Modal,
  Popconfirm,
  Popover,
  Tag,
} from '@douyinfe/semi-ui';
import EditRedemption from '../pages/Redemption/EditRedemption';
import { useTranslation } from 'react-i18next';
import { IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Table } from "react-bootstrap";

function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}

const RedemptionsTable = () => {
  const { t } = useTranslation();

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return (
          <Tag color='green' size='large'>
            {t('未使用')}
          </Tag>
        );
      case 2:
        return (
          <Tag color='red' size='large'>
            {t('已禁用')}
          </Tag>
        );
      case 3:
        return (
          <Tag color='grey' size='large'>
            {t('已使用')}
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
      title: t('ID'),
      dataIndex: 'id',
    },
    {
      title: t('名称'),
      dataIndex: 'name',
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        return <div>{renderStatus(text)}</div>;
      },
    },
    {
      title: t('额度'),
      dataIndex: 'quota',
      render: (text, record, index) => {
        return <div>{renderQuota(parseInt(text))}</div>;
      },
    },
    {
      title: t('创建时间'),
      dataIndex: 'created_time',
      render: (text, record, index) => {
        return <div>{renderTimestamp(text)}</div>;
      },
    },
    {
      title: t('兑换人ID'),
      dataIndex: 'used_user_id',
      render: (text, record, index) => {
        return <div>{text === 0 ? t('无') : text}</div>;
      },
    },
    {
      title: '',
      dataIndex: 'operate',
      render: (text, record, index) => (
        <div>
          <Popover content={record.key} style={{ padding: 20 }} position='top'>
            <Button theme='light' type='tertiary' style={{ marginRight: 1 }}>
              {t('查看')}
            </Button>
          </Popover>
          <Button
            theme='light'
            type='secondary'
            style={{ marginRight: 1 }}
            onClick={async (text) => {
              await copyText(record.key);
            }}
          >
            {t('复制')}
          </Button>
          <Popconfirm
            title={t('确定是否要删除此兑换码？')}
            content={t('此修改将不可逆')}
            okType={'danger'}
            position={'left'}
            onConfirm={() => {
              manageRedemption(record.id, 'delete', record).then(() => {
                removeRecord(record.key);
              });
            }}
          >
            <Button theme='light' type='danger' style={{ marginRight: 1 }}>
              {t('删除')}
            </Button>
          </Popconfirm>
          {record.status === 1 ? (
            <Button
              theme='light'
              type='warning'
              style={{ marginRight: 1 }}
              onClick={async () => {
                manageRedemption(record.id, 'disable', record);
              }}
            >
              {t('禁用')}
            </Button>
          ) : (
            <Button
              theme='light'
              type='secondary'
              style={{ marginRight: 1 }}
              onClick={async () => {
                manageRedemption(record.id, 'enable', record);
              }}
              disabled={record.status === 3}
            >
              {t('启用')}
            </Button>
          )}
          <Button
            theme='light'
            type='tertiary'
            style={{ marginRight: 1 }}
            onClick={() => {
              setEditingRedemption(record);
              setShowEdit(true);
            }}
            disabled={record.status !== 1}
          >
            {t('编辑')}
          </Button>
        </div>
      ),
    },
  ];

  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [tokenCount, setTokenCount] = useState(ITEMS_PER_PAGE);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [editingRedemption, setEditingRedemption] = useState({
    id: undefined,
  });
  const [showEdit, setShowEdit] = useState(false);

  const closeEdit = () => {
    setShowEdit(false);
  };

  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => {
    setModalShow(false);
  }


  const setRedemptionFormat = (redeptions) => {
    setRedemptions(redeptions);
  };

  const loadRedemptions = async (startIdx, pageSize) => {
    const res = await API.get(`/api/redemption/?p=${startIdx}&page_size=${pageSize}`);
    const { success, message, data } = res.data;
    if (success) {
      const newPageData = data.items;
      setActivePage(data.page);
      setTokenCount(data.total);
      setRedemptionFormat(newPageData);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const removeRecord = (key) => {
    let newDataSource = [...redemptions];
    if (key != null) {
      let idx = newDataSource.findIndex((data) => data.key === key);

      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setRedemptions(newDataSource);
      }
    }
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess(t('已复制到剪贴板！'));
    } else {
      // setSearchKeyword(text);
      Modal.error({ title: t('无法复制到剪贴板，请手动复制'), content: text });
    }
  };

  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(redemptions.length / pageSize) + 1) {
        await loadRedemptions(activePage - 1, pageSize);
      }
      setActivePage(activePage);
    })();
  };

  useEffect(() => {
    loadRedemptions(0, pageSize)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, []);

  const refresh = async () => {
    await loadRedemptions(activePage - 1, pageSize);
  };

  const manageRedemption = async (id, action, record) => {
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/redemption/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/redemption/?status_only=true', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/redemption/?status_only=true', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('操作成功完成！'));
      let redemption = res.data.data;
      let newRedemptions = [...redemptions];
      // let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
      if (action === 'delete') {
      } else {
        record.status = redemption.status;
      }
      setRedemptions(newRedemptions);
    } else {
      showError(message);
    }
  };

  const searchRedemptions = async (keyword, page, pageSize) => {
    if (searchKeyword === '') {
      await loadRedemptions(page, pageSize);
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/redemption/search?keyword=${keyword}&p=${page}&page_size=${pageSize}`);
    const { success, message, data } = res.data;
    if (success) {
      const newPageData = data.items;
      setActivePage(data.page);
      setTokenCount(data.total);
      setRedemptionFormat(newPageData);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.target.value);
  };

  const sortRedemption = (key) => {
    if (redemptions.length === 0) return;
    setLoading(true);
    let sortedRedemptions = [...redemptions];
    sortedRedemptions.sort((a, b) => {
      return ('' + a[key]).localeCompare(b[key]);
    });
    if (sortedRedemptions[0].id === redemptions[0].id) {
      sortedRedemptions.reverse();
    }
    setRedemptions(sortedRedemptions);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (searchKeyword === '') {
      loadRedemptions(page, pageSize).then();
    } else {
      searchRedemptions(searchKeyword, page, pageSize).then();
    }
  };

  let pageData = redemptions;
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

  return (
    <>
      <EditRedemption
        refresh={refresh}
        editingRedemption={editingRedemption}
        visiable={showEdit}
        handleClose={closeEdit}
        modalShow={modalShow}
        handleModalClose={handleModalClose}
      ></EditRedemption>

      <div className='searchAdd'>
        <div className='searchBox'>
          <div className="search-container">
            <i className="search-icon"><IconSearch /></i>
            <input type="text" className="search-input" placeholder={t('关键字(id或者名称)')} value={searchKeyword} onChange={handleKeywordChange} />
          </div>
          <button onClick={() => { searchRedemptions(searchKeyword, activePage, pageSize).then(); }} className='searchBtn' style={{ marginLeft: '10px' }}>
            {t('查询')}
          </button>
        </div>
        <button className='searchBtn'
          theme='light'
          type='primary'
          style={{ marginRight: 8 }}
          onClick={() => {
            setEditingRedemption({
              id: undefined,
            });
            setModalShow(true);
          }}
        >
          <IconPlus /> {t('添加兑换码')}
        </button>
      </div>




      <div className="tableData">
        <div className='tableBox'>
          <Table borderless hover>
            <thead>
              <tr>
                <th>{t('ID')} <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>{t('名称')} <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>{t('状态')} <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>{t('额度')} <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>{t('创建时间')} <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>{t('兑换人ID')} <SortIconSvg color="--semi-table-thead-0" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData && pageData.map((redemption) => <tr>
                <td>{redemption.id}</td>
                <td>{redemption.name}</td>
                <td>{renderStatus(redemption.status)}</td>
                <td>{renderQuota(parseInt(redemption.quota))}</td>
                <td>{renderTimestamp(redemption.created_time)}</td>
                <td>{redemption.used_user_id === 0 ? t('无') : redemption.used_user_id}</td>
                <td className="tableActions">
                  <Popover content={redemption.key} position="top" style={{ padding: 20 }}>
                    <Button theme="light" type="tertiary" style={{ marginRight: 8 }}>
                      {t('查看')}
                    </Button>
                  </Popover>

                  <Button
                    theme="light"
                    type="secondary"
                    style={{ marginRight: 8 }}
                    onClick={async () => {
                      await copyText(redemption.key);
                    }}
                  >
                    {t('复制')}
                  </Button>

                  <Popconfirm
                    title={t('确定是否要删除此兑换码？')}
                    content={t('此修改将不可逆')}
                    okType="danger"
                    position="left"
                    onConfirm={async () => {
                      await manageRedemption(redemption.id, 'delete', redemption);
                      removeRecord(redemption.key);
                    }}
                  >
                    <Button theme="light" type="danger" style={{ marginRight: 8 }}>
                      {t('删除')}
                    </Button>
                  </Popconfirm>

                  {redemption.status === 1 ? (
                    <Button
                      theme="light"
                      type="warning"
                      style={{ marginRight: 8 }}
                      onClick={async () => {
                        await manageRedemption(redemption.id, 'disable', redemption);
                      }}
                    >
                      {t('禁用')}
                    </Button>
                  ) : (
                    <Button
                      theme="light"
                      type="secondary"
                      style={{ marginRight: 8 }}
                      onClick={async () => {
                        await manageRedemption(redemption.id, 'enable', redemption);
                      }}
                      disabled={redemption.status === 3}
                    >
                      {t('启用')}
                    </Button>
                  )}

                  <Button
                    theme="light"
                    type="tertiary"
                    onClick={() => {
                      setEditingRedemption(redemption);
                      setModalShow(true);
                    }}
                    disabled={redemption.status !== 1}
                  >
                    {t('编辑')}
                  </Button>
                </td>

              </tr>)}
            </tbody>
          </Table>
        </div>
      </div>
      {/* <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={pageData}
        pagination={{
          currentPage: activePage,
          pageSize: pageSize,
          total: tokenCount,
          showSizeChanger: true,
          pageSizeOpts: [10, 20, 50, 100],
          formatPageText: (page) =>
            t('第 {{start}} - {{end}} 条，共 {{total}} 条', {
              start: page.currentStart,
              end: page.currentEnd,
              total: tokenCount
            }),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setActivePage(1);
            if (searchKeyword === '') {
              loadRedemptions(1, size).then();
            } else {
              searchRedemptions(searchKeyword, 1, size).then();
            }
          },
          onPageChange: handlePageChange,
        }}
        loading={loading}
        rowSelection={rowSelection}
        onRow={handleRow}
      ></Table> */}

    </>
  );
};

export default RedemptionsTable;
