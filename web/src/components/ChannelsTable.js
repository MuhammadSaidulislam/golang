import React, { useEffect, useState } from 'react';
import {
  API,
  isMobile,
  shouldShowPrompt,
  showError,
  showInfo,
  showSuccess,
  showWarning,
  timestamp2string
} from '../helpers';
import filterIcon from "../assets/fi_filter.svg";
import { CHANNEL_OPTIONS, ITEMS_PER_PAGE } from '../constants';
import {
  getQuotaPerUnit,
  renderGroup,
  renderNumberWithPoint,
  renderQuota, renderQuotaWithPrompt
} from '../helpers/render';
import {
  Button, Divider,
  Form, Input,
  InputNumber, Modal,
  Popconfirm,
  Space,
  SplitButtonGroup,
  Switch,
  Tag,
  Tooltip,
  Typography
} from '@douyinfe/semi-ui';
import EditChannel from '../pages/Channel/EditChannel';
import { IconList, IconSearch, IconTreeTriangleDown, IconChevronLeft, IconChevronRight, IconChevronDown } from '@douyinfe/semi-icons';
import { loadChannelModels } from './utils.js';
import EditTagModal from '../pages/Channel/EditTagModal.js';
import TextNumberInput from './custom/TextNumberInput.js';
import { useTranslation } from 'react-i18next';
import NoData from './NoData.js';
import { Table, Dropdown } from 'react-bootstrap';
import deleteIcon from "../assets/Delete.svg";
import disableIcon from "../assets/fi_disable.svg";
import editIcon from "../assets/fi_edit-2.svg";
import chatIcon from "../assets/fi_chat_2.svg";
import copyIcon from "../assets/u_copy-alt.svg";
import enableIcon from "../assets/fi_check.svg";
import { EditIconSvg } from './svgIcon.js';


const ChannelsTable = () => {
  const { t } = useTranslation();

  let type2label = undefined;
  const [count, setCount] = useState(0);
  const renderType = (type) => {
    if (!type2label) {
      type2label = new Map();
      for (let i = 0; i < CHANNEL_OPTIONS.length; i++) {
        type2label[CHANNEL_OPTIONS[i].value] = CHANNEL_OPTIONS[i];
      }
      type2label[0] = { value: 0, text: t('未知类型'), color: 'grey' };
    }
    return <span> {type2label[type]?.text} </span>
  };

  const renderTagType = () => {
    return (
      <Tag
        color='light-blue'
        prefixIcon={<IconList />}
        size='large'
        shape='circle'
        type='light'
      >
        {t('标签聚合')}
      </Tag>
    );
  };

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return (
          <Tag size="large" color="green">
            {t('已启用')}
          </Tag>
        );
      case 2:
        return (
          <Tag size="large" color="yellow">
            {t('已禁用')}
          </Tag>
        );
      case 3:
        return (
          <Tag size="large" color="yellow">
            {t('自动禁用')}
          </Tag>
        );
      default:
        return (
          <Tag size="large" color="grey">
            {t('未知状态')}
          </Tag>
        );
    }
  };

  const renderResponseTime = (responseTime) => {
    let time = responseTime / 1000;
    time = time.toFixed(2) + t(' 秒');
    if (responseTime === 0) {
      return (
        <Tag size="large" color="">
          {t('未测试')}
        </Tag>
      );
    } else if (responseTime <= 1000) {
      return (
        <Tag size="large" color="">
          {time}
        </Tag>
      );
    } else if (responseTime <= 3000) {
      return (
        <Tag size="large" color="">
          {time}
        </Tag>
      );
    } else if (responseTime <= 5000) {
      return (
        <Tag size="large" color="">
          {time}
        </Tag>
      );
    } else {
      return (
        <Tag size="large" color="">
          {time}
        </Tag>
      );
    }
  };

  const [channels, setChannels] = useState([]);
  const [channelList, setChannelList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [idSort, setIdSort] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searching, setSearching] = useState(false);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [showPrompt, setShowPrompt] = useState(
    shouldShowPrompt('channel-test')
  );
  const [channelCount, setChannelCount] = useState(pageSize);
  const [groupOptions, setGroupOptions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [enableBatchDelete, setEnableBatchDelete] = useState(false);
  const [editingChannel, setEditingChannel] = useState({
    id: undefined
  });
  const [showEditTag, setShowEditTag] = useState(false);
  const [editingTag, setEditingTag] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [showEditPriority, setShowEditPriority] = useState(false);
  const [enableTagMode, setEnableTagMode] = useState(false);
  const [showBatchSetTag, setShowBatchSetTag] = useState(false);
  const [batchSetTagValue, setBatchSetTagValue] = useState('');
  const [chartModel, setChartModel] = useState(false);
  const [channelModal, setChannelModal] = useState(false);
  const [sizeArray, setSizeArray] = useState([]);

  const [sizeList, setSizeList] = useState([]);
  const [itemRange, setItemRange] = useState('');
  const channelModalClose = () => {
    setChannelModal(false);
  }

  const removeRecord = async (record) => {
    let newDataSource = [...channels];
    if (record.id != null) {
      let idx = newDataSource.findIndex((data) => {
        if (data.children !== undefined) {
          for (let i = 0; i < data.children.length; i++) {
            if (data.children[i].id === record.id) {
              data.children.splice(i, 1);
              return false;
            }
          }
        } else {
          return data.id === record.id
        }
      });

      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setChannels(newDataSource);
      }
    }
    await refresh();
  };

  const setChannelFormat = (channels, enableTagMode) => {
    let channelDates = [];
    let channelTags = {};
    for (let i = 0; i < channels.length; i++) {
      channels[i].key = '' + channels[i].id;
      let test_models = [];
      channels[i].models.split(',').forEach((item, index) => {
        test_models.push({
          node: 'item',
          name: item,
          onClick: () => {
            testChannel(channels[i], item);
          }
        });
      });
      channels[i].test_models = test_models;
      if (!enableTagMode) {
        channelDates.push(channels[i]);
      } else {
        let tag = channels[i].tag ? channels[i].tag : "";
        // find from channelTags
        let tagIndex = channelTags[tag];
        let tagChannelDates = undefined;
        if (tagIndex === undefined) {
          // not found, create a new tag
          channelTags[tag] = 1;
          tagChannelDates = {
            key: tag,
            id: tag,
            tag: tag,
            name: '标签：' + tag,
            group: '',
            used_quota: 0,
            response_time: 0,
            priority: -1,
            weight: -1,
          };
          tagChannelDates.children = [];
          channelDates.push(tagChannelDates);
        } else {
          // found, add to the tag
          tagChannelDates = channelDates.find((item) => item.key === tag);
        }
        if (tagChannelDates.priority === -1) {
          tagChannelDates.priority = channels[i].priority;
        } else {
          if (tagChannelDates.priority !== channels[i].priority) {
            tagChannelDates.priority = '';
          }
        }
        if (tagChannelDates.weight === -1) {
          tagChannelDates.weight = channels[i].weight;
        } else {
          if (tagChannelDates.weight !== channels[i].weight) {
            tagChannelDates.weight = '';
          }
        }

        if (tagChannelDates.group === '') {
          tagChannelDates.group = channels[i].group;
        } else {
          let channelGroupsStr = channels[i].group;
          channelGroupsStr.split(',').forEach((item, index) => {
            if (tagChannelDates.group.indexOf(item) === -1) {
              // join
              tagChannelDates.group += ',' + item;
            }
          });
        }

        tagChannelDates.children.push(channels[i]);
        if (channels[i].status === 1) {
          tagChannelDates.status = 1;
        }
        tagChannelDates.used_quota += channels[i].used_quota;
        tagChannelDates.response_time += channels[i].response_time;
        tagChannelDates.response_time = tagChannelDates.response_time / 2;
      }

    }
    // data.key = '' + data.id
    setChannels(channelDates);
    if (channelDates.length >= pageSize) {
      setChannelCount(channelDates.length + pageSize);
    } else {
      setChannelCount(channelDates.length);
    }
  };

  const loadChannels = async (startIdx, pageSize, idSort, enableTagMode) => {
    setLoading(true);
    const res = await API.get(
      `/api/channel/?p=${startIdx}&page_size=${pageSize}&id_sort=${idSort}&tag_mode=${enableTagMode}`
    );
    if (res === undefined) {
      return;
    }
    const { success, message, data } = res.data;

    if (success) {
      setChannelList(data.items);
      setActivePage(data.page);
      setPageSize(data.page_size);
      //  setLogCount(data.total);
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

  const copySelectedChannel = async (record) => {
    const channelToCopy = record
    channelToCopy.name += t('_复制');
    channelToCopy.created_time = null;
    channelToCopy.balance = 0;
    channelToCopy.used_quota = 0;
    if (!channelToCopy) {
      showError(t('渠道未找到，请刷新页面后重试。'));
      return;
    }
    try {
      const newChannel = { ...channelToCopy, id: undefined };
      const response = await API.post('/api/channel/', newChannel);
      if (response.data.success) {
        showSuccess(t('渠道复制成功'));
        await refresh();
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError(t('渠道复制失败: ') + error.message);
    }
  };

  const refresh = async () => {
    await loadChannels(activePage, pageSize, idSort, enableTagMode);
  };



  useEffect(() => {
    const localIdSort = localStorage.getItem('id-sort') === 'true';
    const localPageSize = parseInt(localStorage.getItem('page-size')) || ITEMS_PER_PAGE;
    setIdSort(localIdSort);
    setPageSize(localPageSize);
    loadChannels(activePage, pageSize, localIdSort, enableTagMode)
      .then()
      .catch((reason) => {
        showError(reason);
      });
    fetchGroups().then();
    loadChannelModels().then();
  }, []);

  const manageChannel = async (id, action, record, value) => {
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/channel/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/channel/', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/channel/', data);
        break;
      case 'priority':
        if (value === '') {
          return;
        }
        data.priority = parseInt(value);
        res = await API.put('/api/channel/', data);
        break;
      case 'weight':
        if (value === '') {
          return;
        }
        data.weight = parseInt(value);
        if (data.weight < 0) {
          data.weight = 0;
        }
        res = await API.put('/api/channel/', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('操作成功完成！'));
      let channel = res.data.data;
      let newChannels = [...channels];
      if (action === 'delete') {
      } else {
        record.status = channel.status;
      }
      setChannels(newChannels);
    } else {
      showError(message);
    }
  };

  const manageTag = async (tag, action) => {
    let res;
    switch (action) {
      case 'enable':
        res = await API.post('/api/channel/tag/enabled', {
          tag: tag
        });
        break;
      case 'disable':
        res = await API.post('/api/channel/tag/disabled', {
          tag: tag
        });
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作成功完成！');
      let newChannels = [...channels];
      for (let i = 0; i < newChannels.length; i++) {
        if (newChannels[i].tag === tag) {
          let status = action === 'enable' ? 1 : 2;
          newChannels[i]?.children?.forEach((channel) => {
            channel.status = status;
          });
          newChannels[i].status = status;
        }
      }
      setChannels(newChannels);
    } else {
      showError(message);
    }
  };

  const searchChannels = async (searchKeyword, searchGroup, searchModel, enableTagMode) => {
    if (searchKeyword === '' && searchGroup === '' && searchModel === '') {
      await loadChannels(0, pageSize, idSort, enableTagMode);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(
      `/api/channel/search?keyword=${searchKeyword}&group=${searchGroup}&model=${searchModel}&id_sort=${idSort}&tag_mode=${enableTagMode}`
    );
    const { success, message, data } = res.data;
    if (success) {
      setChannelFormat(data, enableTagMode);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const testChannel = async (record, model) => {
    const res = await API.get(`/api/channel/test/${record.id}?model=${model}`);
    const { success, message, time } = res.data;
    if (success) {
      record.response_time = time * 1000;
      record.test_time = Date.now() / 1000;
      showInfo(t('通道 ${name} 测试成功，耗时 ${time.toFixed(2)} 秒。').replace('${name}', record.name).replace('${time.toFixed(2)}', time.toFixed(2)));
    } else {
      showError(message);
    }
  };

  const testAllChannels = async () => {
    const res = await API.get(`/api/channel/test`);
    const { success, message } = res.data;
    if (success) {
      showInfo(t('已成功开始测试所有已启用通道，请刷新页面查看结果。'));
    } else {
      showError(message);
    }
  };

  const deleteAllDisabledChannels = async () => {
    const res = await API.delete(`/api/channel/disabled`);
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(t('已删除所有禁用渠道，共计 ${data} 个').replace('${data}', data));
      await refresh();
    } else {
      showError(message);
    }
  };

  const updateChannelBalance = async (record) => {
    const res = await API.get(`/api/channel/update_balance/${record.id}/`);
    const { success, message, balance } = res.data;
    if (success) {
      record.balance = balance;
      record.balance_updated_time = Date.now() / 1000;
      showInfo(t('通道 ${name} 余额更新成功！').replace('${name}', record.name));
    } else {
      showError(message);
    }
  };

  const updateAllChannelsBalance = async () => {
    setUpdatingBalance(true);
    const res = await API.get(`/api/channel/update_balance`);
    const { success, message } = res.data;
    if (success) {
      showInfo(t('已更新完毕所有已启用通道余额！'));
    } else {
      showError(message);
    }
    setUpdatingBalance(false);
  };

  const batchDeleteChannels = async () => {
    if (selectedChannels.length === 0) {
      showError(t('请先选择要删除的通道！'));
      return;
    }
    setLoading(true);
    let ids = [];
    selectedChannels.forEach((channel) => {
      ids.push(channel.id);
    });
    const res = await API.post(`/api/channel/batch`, { ids: ids });
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(t('已删除 ${data} 个通道！').replace('${data}', data));
      await refresh();
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const fixChannelsAbilities = async () => {
    const res = await API.post(`/api/channel/fix`);
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(t('已修复 ${data} 个通道！').replace('${data}', data));
      await refresh();
    } else {
      showError(message);
    }
  };

  let pageData = channels.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === Math.ceil(channels.length / pageSize) + 1) {
      // In this case we have to load more data and then append them.
      loadChannels(page - 1, pageSize, idSort, enableTagMode).then((r) => {
      });
    }
  };

  const handlePageSizeChange = async (size) => {
    localStorage.setItem('page-size', size + '');
    setPageSize(size);
    setActivePage(1);
    loadChannels(0, size, idSort, enableTagMode)
      .then()
      .catch((reason) => {
        showError(reason);
      });
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
          value: group
        }))
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const submitTagEdit = async (type, data) => {
    switch (type) {
      case 'priority':
        if (data.priority === undefined || data.priority === '') {
          showInfo('优先级必须是整数！');
          return;
        }
        data.priority = parseInt(data.priority);
        break;
      case 'weight':
        if (data.weight === undefined || data.weight < 0 || data.weight === '') {
          showInfo('权重必须是非负整数！');
          return;
        }
        data.weight = parseInt(data.weight);
        break
    }

    try {
      const res = await API.put('/api/channel/tag', data);
      if (res?.data?.success) {
        showSuccess('更新成功！');
        await refresh();
      }
    } catch (error) {
      showError(error);
    }
  }

  const closeEdit = () => {
    setShowEdit(false);
  };

  const handleRow = (record, index) => {
    if (record.status !== 1) {
      return {
        style: {
          background: 'var(--semi-color-disabled-border)'
        }
      };
    } else {
      return {};
    }
  };

  const batchSetChannelTag = async () => {
    if (selectedChannels.length === 0) {
      showError(t('请先选择要设置标签的渠道！'));
      return;
    }
    if (batchSetTagValue === '') {
      showError(t('标签不能为空！'));
      return;
    }
    let ids = selectedChannels.map(channel => channel.id);
    const res = await API.post('/api/channel/batch/tag', {
      ids: ids,
      tag: batchSetTagValue === '' ? null : batchSetTagValue
    });
    if (res.data.success) {
      showSuccess(t('已为 ${count} 个渠道设置标签！').replace('${count}', res.data.data));
      await refresh();
      setShowBatchSetTag(false);
    } else {
      showError(res.data.message);
    }
  };

  const description = "Add Tokens to start tracking Calls <br /> Distribution Metrics.";


  return (
    <>
      <EditTagModal
        visible={showEditTag}
        tag={editingTag}
        handleClose={() => setShowEditTag(false)}
        refresh={refresh}
      />

      <EditChannel
        refresh={refresh}
        visible={showEdit}
        handleClose={closeEdit}
        editingChannel={editingChannel}
        channelModal={channelModal}
        channelModalClose={channelModalClose}
      />




      <div className='searchHeader'>
        <div className='searchFilter channelWrap'>
          <div className='searchOption'>
            <Form
              onSubmit={() => {
                searchChannels(searchKeyword, searchGroup, searchModel, enableTagMode);
              }}
              labelPosition="left"
            >
              <div style={{ display: 'flex' }}>
                <Space>
                  <div className="search-container" style={{ width: "205px" }}>
                    <i className="search-icon"><IconSearch /></i>
                    <input type="text" className="search-input" placeholder={t('搜索渠道的 ID，名称和密钥 ...')} value={searchKeyword} onChange={(v) => {
                      setSearchKeyword(v.target.value);
                    }} />
                  </div>
                  <div className="search-container" style={{ width: "205px" }}>
                    <i className="search-icon"><IconSearch /></i>
                    <input type="text" className="search-input" placeholder={t('模型关键字')} value={searchModel} onChange={(v) => {
                      setSearchModel(v.target.value);
                    }} />
                  </div>
                  <Form.Select
                    optionList={[{ label: t('选择分组'), value: null }, ...groupOptions]}
                    initValue={null}
                    onChange={(v) => {
                      setSearchGroup(v);
                      searchChannels(searchKeyword, v, searchModel, enableTagMode);
                    }}
                  />
                  <button
                    label={t('查询')} className='searchBtn'
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: '8px' }}
                  >
                    {t('查询')}
                  </button>
                </Space>
              </div>
            </Form>
          </div>
          <div className='channelCart'>
            <div className='cardTime channel-dropdown'>
              <div className="icon-container-channel">
                <button className="d-flex align-items-center createChannel" onClick={() => { setEditingChannel({ id: undefined }); setChannelModal(true); }}>{t('添加渠道')}</button>
                <button className="d-flex align-items-center channelIcon" onClick={() => setChartModel(!chartModel)}><IconChevronDown /></button>
              </div>
              {chartModel && <div className="dropdown dashboardDropdown">
                <div className='channelDropdown'>
                  <button className="d-flex align-items-center" onClick={refresh}>{t('刷新')}</button>
                  <button className="d-flex align-items-center" onClick={testAllChannels}>{t('测试所有通道')}</button>
                  <button className="d-flex align-items-center" onClick={updateAllChannelsBalance}>{t('更新所有已启用通道余额')}</button>
                  <button className="d-flex align-items-center" onClick={deleteAllDisabledChannels}>{t('删除禁用通道')}</button>
                  <button className="d-flex align-items-center" onClick={fixChannelsAbilities}>{t('修复数据库一致性')}</button>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
      {channelList && channelList.length === 0 ? <NoData description={description} /> : <>
        <div className="tableData">
          <div className="tableBox">
            <Table borderless hover>
              <thead>
                <tr>
                  <th>{t('ID')}</th>
                  <th>{t('名称')}</th>
                  <th>{t('分组')}</th>
                  <th>{t('类型')}</th>
                  <th>{t('响应时间')}</th>
                  <th>{t('已用额度')}</th>
                  <th>{t('剩余额度')}</th>
                  <th>{t('优先级')}</th>
                  <th>{t('权重')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {channelList && channelList.map((channel, index) => (
                  <tr key={index}>
                    <td>{channel.id}</td>
                    <td>{channel.name}</td>
                    <td>
                      <span>
                        {channel.group
                          ?.split(',')
                          .sort((a, b) => {
                            if (a === 'default') return -1;
                            if (b === 'default') return 1;
                            return a.localeCompare(b);
                          })
                          .map((item) => renderGroup(item.trim()))}
                      </span>
                    </td>


                    <td>  {(() => {
                      if (channel.children === undefined) {
                        return renderType(channel.type);
                      } else {
                        return renderTagType();
                      }
                    })()}</td>
                    <td>{renderResponseTime(channel.response_time)}</td>
                    <td>{renderQuota(channel.used_quota)}</td>
                    <td>
                      {(() => {
                        if (channel.children === undefined) {
                          return (
                            <div>
                              <Space spacing={1}>
                                <Tooltip content={t('剩余额度 ') + channel.balance + t('，点击更新')}>
                                  <span onClick={() => updateChannelBalance(channel)}>
                                    ${renderNumberWithPoint(channel.balance)}
                                  </span>
                                </Tooltip>
                              </Space>
                            </div>
                          );
                        } else {
                          return "";
                        }
                      })()}
                    </td>
                    <td>
                      {(() => {
                        if (channel.children === undefined) {
                          return (
                            <InputNumber
                              style={{ width: 70 }}
                              name="priority"
                              onBlur={(e) => {
                                manageChannel(channel.id, 'priority', channel, e.target.value);
                              }}
                              keepFocus={true}
                              innerButtons
                              defaultValue={channel.priority}
                              min={-999}
                            />
                          );
                        } else {
                          return (
                            <InputNumber
                              style={{ width: 70 }}
                              name="priority"
                              keepFocus={true}
                              onBlur={(e) => {
                                Modal.warning({
                                  title: t('修改子渠道优先级'),
                                  content: t('确定要修改所有子渠道优先级为 ') + e.target.value + t(' 吗？'),
                                  onOk: () => {
                                    if (e.target.value === '') {
                                      return;
                                    }
                                    submitTagEdit('priority', {
                                      tag: channel.key,
                                      priority: e.target.value,
                                    });
                                  },
                                });
                              }}
                              innerButtons
                              defaultValue={channel.priority}
                              min={-999}
                            />
                          );
                        }
                      })()}
                    </td>
                    <td>
                      {(() => {
                        if (channel.children === undefined) {
                          return (
                            <InputNumber
                              style={{ width: 70 }}
                              name="weight"
                              onBlur={(e) => {
                                manageChannel(channel.id, 'weight', channel, e.target.value);
                              }}
                              keepFocus={true}
                              innerButtons
                              defaultValue={channel.weight}
                              min={0}
                            />
                          );
                        } else {
                          return (
                            <InputNumber
                              style={{ width: 70 }}
                              name="weight"
                              keepFocus={true}
                              onBlur={(e) => {
                                Modal.warning({
                                  title: t('修改子渠道权重'),
                                  content: t('确定要修改所有子渠道权重为 ') + e.target.value + t(' 吗？'),
                                  onOk: () => {
                                    if (e.target.value === '') return;
                                    submitTagEdit('weight', {
                                      tag: channel.key,
                                      weight: e.target.value,
                                    });
                                  },
                                });
                              }}
                              innerButtons
                              defaultValue={channel.weight}
                              min={-999}
                            />
                          );
                        }
                      })()}
                    </td>
                    <td className='tableActions'>
                      {(() => {
                        if (channel.children === undefined) {
                          return (
                            <div className='d-flex'>
                              <SplitButtonGroup className='d-flex'
                                style={{ marginRight: '4px' }}
                                aria-label={t('测试单个渠道操作项目组')}
                              >
                                <button className='testBtn' onClick={() => { testChannel(channel, ''); }}  >
                                  {t('测试')}
                                </button>

                                <Dropdown className='testDropdown'>
                                  <Dropdown.Toggle variant="primary" className="d-flex align-items-center" >
                                    <IconChevronDown />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu align="center">
                                    {channel.models.split(',').map((model, index) => (
                                      <li key={index} className="p-2">
                                        {model}
                                      </li>
                                    ))}
                                  </Dropdown.Menu>
                                </Dropdown>
                              </SplitButtonGroup>

                              <Popconfirm
                                title={t('确定是否要删除此渠道？')}
                                content={t('此修改将不可逆')}
                                okType={'danger'}
                                position={'left'}
                                onConfirm={() => {
                                  manageChannel(channel.id, 'delete', channel).then(() => {
                                    removeRecord(channel);
                                  });
                                }}
                              >
                                <button><img src={deleteIcon} alt="tableAction" /></button>
                              </Popconfirm>

                              {channel.status === 1 ? (
                                <button onClick={() => { manageChannel(channel.id, 'disable', channel); }}  >
                                  <img src={disableIcon} alt="tableAction" />
                                </button>
                              ) : (
                                <button onClick={() => { manageChannel(channel.id, 'enable', channel); }}  >
                                  <img src={enableIcon} alt="tableAction" />
                                </button>
                              )}

                              <button onClick={() => { setEditingChannel(channel); setShowEdit(true); setChannelModal(true) }}>
                                <EditIconSvg color="--semi-table-thead-0" />
                              </button>

                              <Popconfirm
                                title={t('确定是否要复制此渠道？')}
                                content={t('复制渠道的所有信息')}
                                okType={'danger'}
                                position={'left'}
                                onConfirm={() => {
                                  copySelectedChannel(channel);
                                }}
                              >
                                <button><img src={copyIcon} alt="tableAction" /></button>
                              </Popconfirm>
                            </div>
                          );
                        } else {
                          return (
                            <>
                              <Button
                                theme="light"
                                type="secondary"
                                style={{ marginRight: 1 }}
                                onClick={() => {
                                  manageTag(channel.key, 'enable');
                                }}
                              >
                                {t('启用全部')}
                              </Button>
                              <Button
                                theme="light"
                                type="warning"
                                style={{ marginRight: 1 }}
                                onClick={() => {
                                  manageTag(channel.key, 'disable');
                                }}
                              >
                                {t('禁用全部')}
                              </Button>
                              <Button
                                theme="light"
                                type="tertiary"
                                style={{ marginRight: 1 }}
                                onClick={() => {
                                  setShowEditTag(true);
                                  setEditingTag(channel.key);
                                }}
                              >
                                {t('编辑')}
                              </Button>
                            </>
                          );
                        }
                      })()}
                    </td>

                  </tr>
                ))}
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

      </>}


      <Modal
        title={t('批量设置标签')}
        visible={showBatchSetTag}
        onOk={batchSetChannelTag}
        onCancel={() => setShowBatchSetTag(false)}
        maskClosable={false}
        centered={true}
      >
        <div style={{ marginBottom: 20 }}>
          <Typography.Text>{t('请输入要设置的标签名称')}</Typography.Text>
        </div>
        <Input
          placeholder={t('请输入标签名称')}
          value={batchSetTagValue}
          onChange={(v) => setBatchSetTagValue(v)}
        />
      </Modal>

    </>
  );
};

export default ChannelsTable;
