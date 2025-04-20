import React, { useEffect, useState } from 'react';
import { Label } from 'semantic-ui-react';
import { API, copy, isAdmin, showError, showSuccess, timestamp2string } from '../helpers';
import NoData from './NoData';
import {
    Tag,
    Form,
    Button,
    Layout,
    Modal,
    Typography, Progress, Card
} from '@douyinfe/semi-ui';
import { ITEMS_PER_PAGE } from '../constants';
import sortIcon from "../assets/sort.svg";
import { Dropdown, Table } from 'react-bootstrap';
import { IconChevronLeft, IconChevronRight, IconSearch, IconChevronDown } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import filterIcon from "../assets/fi_filter.svg";
import downloadIcon from "../assets/fi_download.svg";
import { SortIconSvg } from './svgIcon';


const colors = ['amber', 'blue', 'cyan', 'green', 'grey', 'indigo',
    'light-blue', 'lime', 'orange', 'pink',
    'purple', 'red', 'teal', 'violet', 'yellow'
]


const renderTimestamp = (timestampInSeconds) => {
    const date = new Date(timestampInSeconds * 1000); // 从秒转换为毫秒
    const year = date.getFullYear(); // 获取年份
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份，从0开始需要+1，并保证两位数
    const day = ('0' + date.getDate()).slice(-2); // 获取日期，并保证两位数
    const hours = ('0' + date.getHours()).slice(-2); // 获取小时，并保证两位数
    const minutes = ('0' + date.getMinutes()).slice(-2); // 获取分钟，并保证两位数
    const seconds = ('0' + date.getSeconds()).slice(-2); // 获取秒钟，并保证两位数

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化输出
};

function renderDuration(submit_time, finishTime) {
    // 确保startTime和finishTime都是有效的时间戳
    if (!submit_time || !finishTime) return 'N/A';

    // 将时间戳转换为Date对象
    const start = new Date(submit_time);
    const finish = new Date(finishTime);

    // 计算时间差（毫秒）
    const durationMs = finish - start;

    // 将时间差转换为秒，并保留一位小数
    const durationSec = (durationMs / 1000).toFixed(1);

    // 设置颜色：大于60秒则为红色，小于等于60秒则为绿色
    const color = durationSec > 60 ? 'red' : 'green';

    // 返回带有样式的颜色标签
    return (
        <Tag color={color} size="large">
            {durationSec} 秒
        </Tag>
    );
}

const LogsTable = () => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const isAdminUser = isAdmin();
    const columns = [
        {
            title: "提交时间",
            dataIndex: 'submit_time',
            render: (text, record, index) => {
                return (
                    <div>
                        {text ? renderTimestamp(text) : "-"}
                    </div>
                );
            },
        },
        {
            title: "结束时间",
            dataIndex: 'finish_time',
            render: (text, record, index) => {
                return (
                    <div>
                        {text ? renderTimestamp(text) : "-"}
                    </div>
                );
            },
        },
        {
            title: '进度',
            dataIndex: 'progress',
            width: 50,
            render: (text, record, index) => {
                return (
                    <div>
                        {
                            isNaN(text.replace('%', '')) ? text : <Progress width={42} type="circle" showInfo={true} percent={Number(text.replace('%', '') || 0)} aria-label="drawing progress" />
                        }
                    </div>
                );
            },
        },
        {
            title: '花费时间',
            dataIndex: 'finish_time', // 以finish_time作为dataIndex
            key: 'finish_time',
            render: (finish, record) => {
                // 假设record.start_time是存在的，并且finish是完成时间的时间戳
                return <>
                    {
                        finish ? renderDuration(record.submit_time, finish) : "-"
                    }
                </>
            },
        },
        {
            title: "渠道",
            dataIndex: 'channel_id',
            className: isAdminUser ? 'tableShow' : 'tableHiddle',
            render: (text, record, index) => {
                return (
                    <div>
                        <Tag
                            color={colors[parseInt(text) % colors.length]}
                            size='large'
                            onClick={() => {
                                copyText(text); // 假设copyText是用于文本复制的函数
                            }}
                        >
                            {' '}
                            {text}{' '}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: "平台",
            dataIndex: 'platform',
            render: (text, record, index) => {
                return (
                    <div>
                        {renderPlatform(text)}
                    </div>
                );
            },
        },
        {
            title: '类型',
            dataIndex: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        {renderType(text)}
                    </div>
                );
            },
        },
        {
            title: '任务ID（点击查看详情）',
            dataIndex: 'task_id',
            render: (text, record, index) => {
                return (<Typography.Text
                    ellipsis={{ showTooltip: true }}
                    //style={{width: 100}}
                    onClick={() => {
                        setModalContent(JSON.stringify(record, null, 2));
                        setIsModalOpen(true);
                    }}
                >
                    <div>
                        {text}
                    </div>
                </Typography.Text>);
            },
        },
        {
            title: '任务状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (
                    <div>
                        {renderStatus(text)}
                    </div>
                );
            },
        },

        {
            title: '失败原因',
            dataIndex: 'fail_reason',
            render: (text, record, index) => {
                if (!text) {
                    return '无';
                }

                return (
                    <Typography.Text
                        ellipsis={{ showTooltip: true }}
                        style={{ width: 100 }}
                        onClick={() => {
                            setModalContent(text);
                            setIsModalOpen(true);
                        }}
                    >
                        {text}
                    </Typography.Text>
                );
            }
        }
    ];

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(1);
    const [logCount, setLogCount] = useState(ITEMS_PER_PAGE);
    const [logType] = useState(0);

    let now = new Date();
    // 初始化start_timestamp为前一天
    let zeroNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [inputs, setInputs] = useState({
        channel_id: '',
        task_id: '',
        start_timestamp: timestamp2string(zeroNow.getTime() / 1000),
        end_timestamp: '',
    });
    const { channel_id, task_id, start_timestamp, end_timestamp } = inputs;

    const handleInputChange = (value, name) => {
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    };


    const setLogsFormat = (logs) => {
        for (let i = 0; i < logs.length; i++) {
            logs[i].timestamp2string = timestamp2string(logs[i].created_at);
            logs[i].key = '' + logs[i].id;
        }
        // data.key = '' + data.id
        setLogs(logs);
        setLogCount(logs.length + ITEMS_PER_PAGE);
        // console.log(logCount);
    }

    const loadLogs = async (startIdx) => {
        setLoading(true);

        let url = '';
        let localStartTimestamp = parseInt(Date.parse(start_timestamp) / 1000);
        let localEndTimestamp = parseInt(Date.parse(end_timestamp) / 1000);
        if (isAdminUser) {
            url = `/api/task/?p=${startIdx}&channel_id=${channel_id}&task_id=${task_id}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
        } else {
            url = `/api/task/self?p=${startIdx}&task_id=${task_id}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
        }
        const res = await API.get(url);
        let { success, message, data } = res.data;
        if (success) {
            if (startIdx === 0) {
                setLogsFormat(data);
            } else {
                let newLogs = [...logs];
                newLogs.splice(startIdx * ITEMS_PER_PAGE, data.length, ...data);
                setLogsFormat(newLogs);
            }
        } else {
            showError(message);
        }
        setLoading(false);
    };

    const pageData = logs.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);


    const handlePageChange = page => {
        setActivePage(page);
        if (page === Math.ceil(logs.length / ITEMS_PER_PAGE) + 1) {
            loadLogs(page - 1).then(r => {
            });
        }
    };

    const refresh = async () => {
        // setLoading(true);
        setActivePage(1);
        await loadLogs(0);
    };

    const copyText = async (text) => {
        if (await copy(text)) {
            showSuccess('已复制：' + text);
        } else {
            // setSearchKeyword(text);
            Modal.error({ title: "无法复制到剪贴板，请手动复制", content: text });
        }
    }

    useEffect(() => {
        refresh().then();
    }, [logType]);

    const renderType = (type) => {
        switch (type) {
            case 'MUSIC':
                return <Label basic color='grey'> 生成音乐 </Label>;
            case 'LYRICS':
                return <Label basic color='pink'> 生成歌词 </Label>;

            default:
                return <Label basic color='black'> 未知 </Label>;
        }
    }

    const renderPlatform = (type) => {
        switch (type) {
            case "suno":
                return <Label basic color='green'> Suno </Label>;
            default:
                return <Label basic color='black'> 未知 </Label>;
        }
    }

    const renderStatus = (type) => {
        switch (type) {
            case 'SUCCESS':
                return <Label basic color='green'> 成功 </Label>;
            case 'NOT_START':
                return <Label basic color='black'> 未启动 </Label>;
            case 'SUBMITTED':
                return <Label basic color='yellow'> 队列中 </Label>;
            case 'IN_PROGRESS':
                return <Label basic color='blue'> 执行中 </Label>;
            case 'FAILURE':
                return <Label basic color='red'> 失败 </Label>;
            case 'QUEUED':
                return <Label basic color='red'> 排队中 </Label>;
            case 'UNKNOWN':
                return <Label basic color='red'> 未知 </Label>;
            case '':
                return <Label basic color='black'> 正在提交 </Label>;
            default:
                return <Label basic color='black'> 未知 </Label>;
        }
    }

    const description = "Add Tokens to start tracking Calls <br /> Distribution Metrics.";
    const [searchKeyword, setSearchKeyword] = useState('');
    const [chartModel, setChartModel] = useState(false);
    const handleKeywordChange = async (value) => {
        setSearchKeyword(value.target.value);
    };


    return (
        <>

            {/* <NoData description={description} /> */}

            {/* Table header */}
            <div className='searchHeader'>
                <div className='searchFilter'>
                    <div className='searchOption'>
                        <div className="search-container">
                            <i className="search-icon"><IconSearch /></i>
                            <input type="text" className="search-input" placeholder={t('令牌名称')} value={searchKeyword} onChange={handleKeywordChange} />
                        </div>
                        <button className='searchBtn' style={{ marginLeft: '10px' }}>
                            {t('查询')}
                        </button>
                    </div>
                    <div className=''>
                        <div className='cardTime'>
                            <div className="icon-container" onClick={() => setChartModel(!chartModel)}>
                                <div className="user-icon">
                                    <button className="d-flex align-items-center"><img src={filterIcon} alt="filter" style={{ marginRight: '5px' }} /> <span>Filter</span></button>
                                </div>
                            </div>
                            {chartModel && <div className="dropdown dashboardDropdown">
                                <Form layout='horizontal'>
                                    {isAdminUser && <Form.Input field="channel_id" label={t('渠道 ID')} value={channel_id}
                                        placeholder={t('可选值')} name='channel_id'
                                        onChange={value => handleInputChange(value, 'channel_id')} />
                                    }
                                    <Form.Input field="task_id" label={t('任务 ID')} value={task_id}
                                        placeholder={t('可选值')}
                                        name='task_id'
                                        onChange={value => handleInputChange(value, 'task_id')} />


                                    <Form.DatePicker field="start_timestamp" label={t('起始时间')}
                                        initValue={start_timestamp}
                                        value={start_timestamp} type='dateTime'
                                        name='start_timestamp'
                                        onChange={value => handleInputChange(value, 'start_timestamp')} />
                                    <Form.DatePicker field="end_timestamp" fluid label={t('结束时间')}
                                        initValue={end_timestamp}
                                        value={end_timestamp} type='dateTime'
                                        name='end_timestamp'
                                        onChange={value => handleInputChange(value, 'end_timestamp')} />
                                    <button className='searchBtn d-block mt-3 w-100' type='submit' onClick={refresh} >
                                        {t('查询')}
                                    </button>
                                </Form>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            {pageData && pageData.length === 0 ? <NoData description={description} /> : <>
                <div className="tableData">
                    <div className="tableBox">
                        <Table borderless hover>
                            <thead>
                                <tr>
                                    <th>{t('提交时间')}</th>
                                    <th>{t('结束时间')}</th>
                                    <th>{t('进度')}</th>
                                    <th>{t('花费时间')}</th>
                                    {isAdminUser ? <th>{t('渠道')}</th> : ""}
                                    <th>{t('平台')}</th>
                                    <th>{t('类型')}</th>
                                    <th>{t('任务ID（点击查看详情）')}</th>
                                    <th>{t('任务状态')}</th>
                                    <th>{t('失败原因')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData && pageData.map((logs, index) => (
                                    <tr key={index}>
                                        <td>{logs.submit_time ? renderTimestamp(logs.submit_time) : "-"}</td>
                                        <td>{logs.finish_time ? renderTimestamp(logs.finish_time) : "-"}</td>
                                        <td> {
                                            isNaN(logs.progress.replace('%', '')) ? logs.progress : <Progress width={42} type="circle" showInfo={true} percent={Number(logs.progress.replace('%', '') || 0)} aria-label="drawing progress" />
                                        }</td>
                                        <td>{logs.finish_time ? renderDuration(logs.submit_time, finish) : "-"}</td>
                                        {isAdminUser ? <td> <Tag
                                            color={colors[parseInt(logs.channel_id) % colors.length]}
                                            size='large'
                                            onClick={() => {
                                                copyText(logs.channel_id);
                                            }}
                                        >
                                            {logs.channel_id}
                                        </Tag></td> : ""}
                                        <td>{renderPlatform(logs.platform)}</td>
                                        <td>{renderType(logs.action)}</td>
                                        <td><Typography.Text
                                            ellipsis={{ showTooltip: true }}
                                            onClick={() => {
                                                setModalContent(JSON.stringify(logs, null, 2));
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <div>
                                                {logs.task_id}
                                            </div>
                                        </Typography.Text></td>
                                        <td>{renderStatus(logs.status)}</td>
                                        <td>{logs.fail_reason ? <Typography.Text
                                            ellipsis={{ showTooltip: true }}
                                            style={{ width: 100 }}
                                            onClick={() => {
                                                setModalContent(logs.fail_reason);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            {logs.fail_reason}
                                        </Typography.Text> : "无"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
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
            </>}




            {/*  <Form layout='horizontal' labelPosition='inset'>
                    <>
                        {isAdminUser && <Form.Input field="channel_id" label='渠道 ID' value={channel_id}
                            placeholder={'可选值'} name='channel_id'
                            onChange={value => handleInputChange(value, 'channel_id')} />
                        }
                        <Form.Input field="task_id" label={"任务 ID"} value={task_id}
                            placeholder={"可选值"}
                            name='task_id'
                            onChange={value => handleInputChange(value, 'task_id')} />

                        <Form.DatePicker field="start_timestamp" label={"起始时间"}
                            initValue={start_timestamp}
                            value={start_timestamp} type='dateTime'
                            name='start_timestamp'
                            onChange={value => handleInputChange(value, 'start_timestamp')} />
                        <Form.DatePicker field="end_timestamp" fluid label={"结束时间"}
                            initValue={end_timestamp}
                            value={end_timestamp} type='dateTime'
                            name='end_timestamp'
                            onChange={value => handleInputChange(value, 'end_timestamp')} />
                        <Button label={"查询"} type="primary" htmlType="submit" className="btn-margin-right"
                            onClick={refresh}>查询</Button>
                    </>
                </Form>
                <Card>
                    <Table columns={columns} dataSource={pageData} pagination={{
                        currentPage: activePage,
                        pageSize: ITEMS_PER_PAGE,
                        total: logCount,
                        pageSizeOpts: [10, 20, 50, 100],
                        onPageChange: handlePageChange,
                    }} loading={loading} />
                </Card> */}
            <Modal
                visible={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                closable={null}
                bodyStyle={{ height: '400px', overflow: 'auto' }} // 设置模态框内容区域样式
                width={800} // 设置模态框宽度
            >
                <p style={{ whiteSpace: 'pre-line' }}>{modalContent}</p>
            </Modal>

        </>
    );
};

export default LogsTable;
