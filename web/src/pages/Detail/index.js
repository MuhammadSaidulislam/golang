import React, { useCallback, useContext, useEffect, useRef, useState, userRef } from 'react';
import { initVChartSemiTheme } from '@visactor/vchart-semi-theme';

import { Button, Card, Col, Descriptions, Form, Layout, Row, Spin, Tabs, Switch } from '@douyinfe/semi-ui';
import { VChart } from "@visactor/react-vchart";
import {
  API,
  isAdmin,
  showError,
  timestamp2string,
  timestamp2string1,
} from '../../helpers';
import {
  getQuotaWithUnit,
  modelColorMap,
  renderNumber,
  renderQuota,
  renderQuotaNumberWithDigit,
  stringToColor,
  modelToColor,
} from '../../helpers/render';
import { UserContext } from '../../context/User/index.js';
import { StyleContext } from '../../context/Style/index.js';
import { useTranslation } from 'react-i18next';
import dashboardIcon from "../../assets/fi_bar-chart-2.svg";
import playIcon from "../../assets/fi_clock.svg";
import chatIcon from "../../assets/Chat.svg";
import tokenIcon from "../../assets/fi_code.svg";
import walletIcon from "../../assets/Wallet.svg";
import logsIcon from "../../assets/draw.svg";
import tasksIcon from "../../assets/fi_globe.svg";
import priceIcon from "../../assets/fi_list.svg";

import chatgptIcon from "../../assets/chatgpt.svg";
import contactIcon from "../../assets/contactUs.png";
import aiIcon from "../../assets/platform.svg";
import blogIcon from "../../assets/blog.svg";
import settingIcon from "../../assets/Setting.svg";
import DashboardLayout from './../../components/DashboardLayout';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Sector } from 'recharts';


const areaData = [
  { name: '12 - 27 09:00', value: 0.8 },
  { name: '4 - 20 10:00', value: 0.7 },
  { name: '12 - 27 16:00', value: 0.9 },
  { name: '11 - 27 11:00', value: 0.75 },
  { name: '11 - 27 11:00', value: 0.65 },
  { name: '12 - 27 01:00', value: 0.55 },
  { name: '12 - 27 05:00', value: 0.45 },
  { name: '11 - 27 11:00', value: 0.35 },
  { name: '11 - 27 05:00', value: 0.15 },
  { name: '12 - 27 10:00', value: 0.25 },
  { name: '11 - 27 11:00', value: 0.35 },
  { name: '11 - 27 02:00', value: 0.55 },
  { name: '11 - 27 11:00', value: 0.75 },
  { name: '11 - 27 02:00', value: 0.6 },
];
const tableData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];
const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"];
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${payload.type}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${payload.value}`}
      </text>
    </g>
  );
};

const Detail = (props) => {
  const { t } = useTranslation();
  const formRef = useRef();
  let now = new Date();
  const [userState, userDispatch] = useContext(UserContext);
  const [styleState, styleDispatch] = useContext(StyleContext);
  const [inputs, setInputs] = useState({
    username: '',
    token_name: '',
    model_name: '',
    start_timestamp:
      localStorage.getItem('data_export_default_time') === 'hour'
        ? timestamp2string(now.getTime() / 1000 - 86400)
        : localStorage.getItem('data_export_default_time') === 'week'
          ? timestamp2string(now.getTime() / 1000 - 86400 * 30)
          : timestamp2string(now.getTime() / 1000 - 86400 * 7),
    end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
    channel: '',
    data_export_default_time: '',
  });

  const { username, model_name, start_timestamp, end_timestamp, channel } = inputs;
  const isAdminUser = isAdmin();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(false);
  const [quotaData, setQuotaData] = useState([]);
  const [consumeQuota, setConsumeQuota] = useState(0);
  const [consumeTokens, setConsumeTokens] = useState(0);
  const [times, setTimes] = useState(0);
  const [dataExportDefaultTime, setDataExportDefaultTime] = useState(
    localStorage.getItem('data_export_default_time') || 'hour',
  );
  const [pieData, setPieData] = useState([{ type: 'null', value: '0' }]);
  const [lineData, setLineData] = useState([]);
  console.log('lineData', lineData);

  const [spec_pie, setSpecPie] = useState({
    type: 'pie',
    data: [{
      id: 'id0',
      values: pieData
    }],
    outerRadius: 0.8,
    innerRadius: 0.5,
    padAngle: 0.6,
    valueField: 'value',
    categoryField: 'type',
    pie: {
      style: {
        cornerRadius: 10,
      },
      state: {
        hover: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1,
        },
        selected: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1,
        },
      },
    },
    title: {
      visible: true,
      text: t('模型调用次数占比'),
      subtext: `${t('总计')}：${renderNumber(times)}`,
    },
    legends: {
      visible: true,
      orient: 'left',
    },
    label: {
      visible: true,
    },
    tooltip: {
      mark: {
        content: [
          {
            key: (datum) => datum['type'],
            value: (datum) => renderNumber(datum['value']),
          },
        ],
      },
    },
    color: {
      specified: modelColorMap,
    },
  });
  const [spec_line, setSpecLine] = useState({
    type: 'bar',
    data: [{
      id: 'barData',
      values: lineData
    }],
    xField: 'Time',
    yField: 'Usage',
    seriesField: 'Model',
    stack: true,
    legends: {
      visible: true,
      selectMode: 'single',
    },
    title: {
      visible: true,
      text: t('模型消耗分布'),
      subtext: `${t('总计')}：${renderQuota(consumeQuota, 2)}`,
    },
    bar: {
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1,
        },
      },
    },
    tooltip: {
      mark: {
        content: [
          {
            key: (datum) => datum['Model'],
            value: (datum) => renderQuota(datum['rawQuota'] || 0, 4),
          },
        ],
      },
      dimension: {
        content: [
          {
            key: (datum) => datum['Model'],
            value: (datum) => datum['rawQuota'] || 0,
          },
        ],
        updateContent: (array) => {
          array.sort((a, b) => b.value - a.value);
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
            if (array[i].key == "其他") {
              continue;
            }
            let value = parseFloat(array[i].value);
            if (isNaN(value)) {
              value = 0;
            }
            if (array[i].datum && array[i].datum.TimeSum) {
              sum = array[i].datum.TimeSum;
            }
            array[i].value = renderQuota(value, 4);
          }
          array.unshift({
            key: t('总计'),
            value: renderQuota(sum, 4),
          });
          return array;
        },
      },
    },
    color: {
      specified: modelColorMap,
    },
  });

  // 添加一个新的状态来存储模型-颜色映射
  const [modelColors, setModelColors] = useState({});

  const handleInputChange = (value, name) => {
    if (name === 'data_export_default_time') {
      setDataExportDefaultTime(value);
      return;
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const loadQuotaData = async () => {
    setLoading(true);
    try {
      let url = '';
      let localStartTimestamp = Date.parse(start_timestamp) / 1000;
      let localEndTimestamp = Date.parse(end_timestamp) / 1000;
      if (isAdminUser) {
        url = `/api/data/?username=${username}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&default_time=${dataExportDefaultTime}`;
      } else {
        url = `/api/data/self/?start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&default_time=${dataExportDefaultTime}`;
      }
      const res = await API.get(url);
      const { success, message, data } = res.data;
      console.log(success, message);

      if (!success) {
        setQuotaData(data);
        if (data.length === 0) {
          data.push({
            count: 0,
            model_name: '无数据',
            quota: 0,
            created_at: now.getTime() / 1000,
          });
        }
        // sort created_at
        data.sort((a, b) => a.created_at - b.created_at);
        updateChartData(data);
      } else {
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadQuotaData();
  };

  const initChart = async () => {
    await loadQuotaData();
  };

  const updateChartData = (data) => {
    let newPieData = [];
    let newLineData = [];
    let totalQuota = 0;
    let totalTimes = 0;
    let uniqueModels = new Set();
    let totalTokens = 0;

    // 收集所有唯一的模型名称
    data.forEach(item => {
      uniqueModels.add(item.model_name);
      totalTokens += item.token_used;
      totalQuota += item.quota;
      totalTimes += item.count;
    });

    // 处理颜色映射
    const newModelColors = {};
    Array.from(uniqueModels).forEach((modelName) => {
      newModelColors[modelName] = modelColorMap[modelName] ||
        modelColors[modelName] ||
        modelToColor(modelName);
    });
    setModelColors(newModelColors);

    // 按时间和模型聚合数据
    let aggregatedData = new Map();
    data.forEach(item => {
      const timeKey = timestamp2string1(item.created_at, dataExportDefaultTime);
      const modelKey = item.model_name;
      const key = `${timeKey}-${modelKey}`;
      if (!aggregatedData.has(key)) {
        aggregatedData.set(key, {
          time: timeKey,
          model: modelKey,
          quota: 0,
          count: 0
        });
      }

      const existing = aggregatedData.get(key);
      existing.quota += item.quota;
      existing.count += item.count;
    });

    // 处理饼图数据
    let modelTotals = new Map();
    for (let [_, value] of aggregatedData) {
      if (!modelTotals.has(value.model)) {
        modelTotals.set(value.model, 0);
      }
      modelTotals.set(value.model, modelTotals.get(value.model) + value.count);
    }

    newPieData = Array.from(modelTotals).map(([model, count]) => ({
      type: model,
      value: count
    }));

    // 生成时间点序列
    let timePoints = Array.from(new Set([...aggregatedData.values()].map(d => d.time)));
    if (timePoints.length < 7) {
      const lastTime = Math.max(...data.map(item => item.created_at));
      const interval = dataExportDefaultTime === 'hour' ? 3600
        : dataExportDefaultTime === 'day' ? 86400
          : 604800;

      timePoints = Array.from({ length: 7 }, (_, i) =>
        timestamp2string1(lastTime - (6 - i) * interval, dataExportDefaultTime)
      );
    }

    // 生成柱状图数据
    timePoints.forEach(time => {
      // 为每个时间点收集所有模型的数据
      let timeData = Array.from(uniqueModels).map(model => {
        const key = `${time}-${model}`;
        const aggregated = aggregatedData.get(key);
        return {
          Time: time,
          Model: model,
          rawQuota: aggregated?.quota || 0,
          Usage: aggregated?.quota ? getQuotaWithUnit(aggregated.quota, 4) : 0
        };
      });

      // 计算该时间点的总计
      const timeSum = timeData.reduce((sum, item) => sum + item.rawQuota, 0);

      // 按照 rawQuota 从大到小排序
      timeData.sort((a, b) => b.rawQuota - a.rawQuota);

      // 为每个数据点添加该时间的总计
      timeData = timeData.map(item => ({
        ...item,
        TimeSum: timeSum
      }));

      // 将排序后的数据添加到 newLineData
      newLineData.push(...timeData);
    });

    // 排序
    newPieData.sort((a, b) => b.value - a.value);
    newLineData.sort((a, b) => a.Time.localeCompare(b.Time));

    // 更新图表配置和数据
    setSpecPie(prev => ({
      ...prev,
      data: [{ id: 'id0', values: newPieData }],
      title: {
        ...prev.title,
        subtext: `${t('总计')}：${renderNumber(totalTimes)}`
      },
      color: {
        specified: newModelColors
      }
    }));

    setSpecLine(prev => ({
      ...prev,
      data: [{ id: 'barData', values: newLineData }],
      title: {
        ...prev.title,
        subtext: `${t('总计')}：${renderQuota(totalQuota, 2)}`
      },
      color: {
        specified: newModelColors
      }
    }));

    setPieData(newPieData);
    setLineData(newLineData);
    setConsumeQuota(totalQuota);
    setTimes(totalTimes);
    setConsumeTokens(totalTokens);
  };

  const getUserData = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getUserData()
    if (!initialized.current) {
      initVChartSemiTheme({
        isWatchingThemeSwitch: true,
      });
      initialized.current = true;
      initChart();
    }
  }, []);

  // sidebar
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  let previousWidth = -1;

  const updateWidth = () => {
    const width = window.innerWidth;
    const widthLimit = 576;
    const isCurrentlyMobile = width <= widthLimit;
    const wasMobile = previousWidth <= widthLimit;

    if (isCurrentlyMobile !== wasMobile) {
      setIsOpen(!isCurrentlyMobile);
    }
    previousWidth = width;
  };

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);


  const [graphModel, setGraphModel] = useState(false);
  const [chartModel, setChartModel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userDropdown, setUserDropdown] = useState(false);
  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdown(!userDropdown);
  };


  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <>
      <DashboardLayout>

        <div className='gap-2 dashboardHead'>
          <div className='wallet-card' style={{ minHeight: '145px', width: '100%' }}>
            <div className="curve-container">
              <div className="curve-1"></div>
              <div className="curve-2"></div>
              <div className="curve-3"></div>
              <div className="curve-4"></div>
            </div>
            <div className='cardHeader'>
              <div className='cardHeading'>
                Balance Summary
              </div>
            </div>
            <div className='cardContent'>
              <div style={{ width: '100%' }}>
                <h6>{t('当前余额')}</h6>
                <p>{renderQuota(userState?.user?.quota)}</p>
              </div>
              <div style={{ width: '100%' }}>
                <h6>{t('历史消耗')}</h6>
                <p>{renderQuota(userState?.user?.used_quota)}</p>
              </div>
              <div style={{ width: '100%' }}>
                <h6>{t('请求次数')}</h6>
                <p>{userState.user?.request_count} <span>+0.00%</span></p>
              </div>
            </div>
          </div>
          <div className='firstBox' style={{ minHeight: '145px', width: '100%' }}>
            <div className='cardHeader'>
              <div className='cardText'>
                Statistical Summary
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
              <div style={{ width: '100%' }}>
                <h6>{t('统计额度')}</h6>
                <p>{renderQuota(consumeQuota)}</p>
              </div>
              <div style={{ width: '100%' }}>
                <h6>{t('统计Tokens')}</h6>
                <p>{consumeTokens}</p>
              </div>
              <div style={{ width: '100%' }}>
                <h6>{t('统计次数')}</h6>
                <p>{times}</p>
              </div>
            </div>
          </div>
          <div className='firstBox' style={{ minHeight: '145px', minWidth: '260px' }}>
            <div className='cardHeader'>
              <div className='cardContent'>
                <div>
                  <h6>{t('平均RPM')}</h6>
                  <p> {(times /
                    ((Date.parse(end_timestamp) -
                      Date.parse(start_timestamp)) /
                      60000)).toFixed(3)}</p>
                </div>
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
              <div style={{ width: '100%' }}>
                <h6>{t('平均TPM')}</h6>
                <p>{(consumeTokens /
                  ((Date.parse(end_timestamp) -
                    Date.parse(start_timestamp)) /
                    60000)).toFixed(3)}</p>
              </div>
            </div>
          </div>
        </div>
        { /* graph */}
        <div className='modelGraph'>
          <div className="graphHeading mb-2">
            <h2>Model Consumption distribution</h2>
            <div className='cardTime'>
              <div className="icon-container" onClick={() => setGraphModel(!graphModel)}>
                <div className="user-icon">
                  Filter <IconChevronDown />
                </div>
              </div>
              {graphModel && (
                <div className="dropdown dashboardDropdown">
                  <Form ref={formRef} layout='horizontal' style={{ marginTop: 10 }}>
                    <div className='w-100'>
                      <Form.DatePicker
                        field='start_timestamp'
                        label={t('起始时间')}
                        style={{ width: '100%' }}
                        initValue={start_timestamp}
                        value={start_timestamp}
                        type='dateTime'
                        name='start_timestamp'
                        onChange={(value) => {
                          handleInputChange(value, 'start_timestamp');
                        }}
                      />
                    </div>
                    <div className='w-100 mt-3'>
                      <Form.DatePicker
                        field='end_timestamp'
                        fluid
                        label={t('结束时间')}
                        style={{ width: '100%' }}
                        initValue={end_timestamp}
                        value={end_timestamp}
                        type='dateTime'
                        name='end_timestamp'
                        onChange={(value) => {
                          handleInputChange(value, 'end_timestamp');
                        }}
                      />
                    </div>
                    <div className='w-100 mt-3'>
                      <Form.Select
                        field='data_export_default_time'
                        label={t('时间粒度')}
                        style={{ width: '100%' }}
                        initValue={dataExportDefaultTime}
                        placeholder={t('时间粒度')}
                        name='data_export_default_time'
                        optionList={[
                          { label: t('小时'), value: 'hour' },
                          { label: t('天'), value: 'day' },
                          { label: t('周'), value: 'week' },
                        ]}
                        onChange={(value) =>
                          handleInputChange(value, 'data_export_default_time')
                        }
                      ></Form.Select>
                    </div>
                    <div className='w-100 mt-3'>
                      {isAdminUser && (
                        <Form.Input
                          field='username'
                          label={t('用户名称')}
                          style={{ width: '100%' }}
                          value={username}
                          placeholder={t('可选值')}
                          name='username'
                          onChange={(value) => handleInputChange(value, 'username')}
                        />
                      )}
                    </div>
                    <button className='searchBtn d-block mt-3 w-100' type='submit' onClick={refresh} >
                      {t('查询')}
                    </button>
                  </Form>
                </div>)}
            </div>
          </div>
          <div className="h-48" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4889F4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4889F4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                <YAxis domain={[0, 1]} tickCount={5} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4889F4"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        { /* chart */}

        <div className="modelGraph">
          <div className="graphHeading mb-2">
            <h2>Model Consumption distribution</h2>
            <div className='cardTime'>
              <div className="icon-container" onClick={() => setChartModel(!chartModel)}>
                <div className="user-icon">
                  Filter <IconChevronDown />
                </div>
              </div>
              {chartModel && (
                <div className="dropdown dashboardDropdown">
                  <Form ref={formRef} layout='horizontal' style={{ marginTop: 10 }}>
                    <div className='w-100'>
                      <Form.DatePicker
                        field='start_timestamp'
                        label={t('起始时间')}
                        style={{ width: '100%' }}
                        initValue={start_timestamp}
                        value={start_timestamp}
                        type='dateTime'
                        name='start_timestamp'
                        onChange={(value) => {
                          handleInputChange(value, 'start_timestamp');
                        }}
                      />
                    </div>
                    <div className='w-100 mt-3'>
                      <Form.DatePicker
                        field='end_timestamp'
                        fluid
                        label={t('结束时间')}
                        style={{ width: '100%' }}
                        initValue={end_timestamp}
                        value={end_timestamp}
                        type='dateTime'
                        name='end_timestamp'
                        onChange={(value) => {
                          handleInputChange(value, 'end_timestamp');
                        }}
                      />
                    </div>
                    <div className='w-100 mt-3'>
                      <Form.Select
                        field='data_export_default_time'
                        label={t('时间粒度')}
                        style={{ width: '100%' }}
                        initValue={dataExportDefaultTime}
                        placeholder={t('时间粒度')}
                        name='data_export_default_time'
                        optionList={[
                          { label: t('小时'), value: 'hour' },
                          { label: t('天'), value: 'day' },
                          { label: t('周'), value: 'week' },
                        ]}
                        onChange={(value) =>
                          handleInputChange(value, 'data_export_default_time')
                        }
                      ></Form.Select>
                    </div>
                    <div className='w-100 mt-3'>
                      {isAdminUser && (
                        <Form.Input
                          field='username'
                          label={t('用户名称')}
                          style={{ width: '100%' }}
                          value={username}
                          placeholder={t('可选值')}
                          name='username'
                          onChange={(value) => handleInputChange(value, 'username')}
                        />
                      )}
                    </div>
                    <button className='searchBtn d-block mt-3 w-100' type='submit' onClick={refresh} >
                      {t('查询')}
                    </button>
                  </Form>
                </div>)}
            </div>
          </div>
          <div className="h-48" style={{ height: '280px' }}>
            <ResponsiveContainer>
              <PieChart width={400} height={400}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <Layout.Content>


          {/*  <Spin spinning={loading}>
            <Card style={{ marginTop: 20 }}>
              <Tabs type="line" defaultActiveKey="1">
                <Tabs.TabPane tab={t('消耗分布')} itemKey="1">
                  <div style={{ height: 500 }}>
                    <VChart
                      spec={spec_line}
                      option={{ mode: "desktop-browser" }}
                    />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={t('调用次数分布')} itemKey="2">
                  <div style={{ height: 500 }}>
                    <VChart
                      spec={spec_pie}
                      option={{ mode: "desktop-browser" }}
                    />
                  </div>
                </Tabs.TabPane>

              </Tabs>
            </Card>
          </Spin> */}
        </Layout.Content>
      </DashboardLayout>
    </>
  );
};

export default Detail;
