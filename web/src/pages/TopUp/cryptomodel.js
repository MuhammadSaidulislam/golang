import React, { useEffect, useState } from 'react';
import { API, showError, showInfo } from '../../helpers';
import copy from 'clipboard-copy';
import { useNavigate } from 'react-router-dom';
import { Select } from '@douyinfe/semi-ui';

const CryptoModel = () => {
    const [selectedItem, setSelectedItem] = useState("");
    const [uuid, setUuid] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [input, setInput] = useState(0);
    const [min, setMin] = useState(0);
    const [est, setEst] = useState(0);
    const [items, setItems] = useState([]);
    const [info, setInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const copyText = (text) => {
        copy(text);
        showInfo('Address has been Copied');
    };
    let selectedItem_prev = ""
    const inputChangeHandler = (e) => {
        const [selected_currency, selected_network] = selectedItem.split(' / ')
        setInput(e.target.value)
        const currency = currencies.find(item => item.currency === selected_currency && item.network === selected_network)
        if (currency !== undefined)
            setEst(currency.conversion_rate * e.target.value)
    };
    const startCountdown = (expirationTime) => {
        const interval = setInterval(async () => {
            try {
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const remainingTime = expirationTime - currentTime;

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    setTimeLeft(0); // Ensure timer stops
                } else {
                    setTimeLeft(remainingTime); // Update timer state
                }
            } catch (error) {
                console.error("Error fetching redirect URL:", error);
            }
        }, 1000); // Runs every second
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const createTransactionHandle = () => {
        if (est > min) {
            const [selected_currency, selected_network] = selectedItem.split(' / ')
            const currency = currencies.find(item => item.currency === selected_currency && item.network === selected_network)
            if (currency !== undefined) {
                API.post('/api/user/createtransaction', {
                    currency: currency.currency,
                    network: currency.network,
                    amount: String(input),
                }).then((res) => {
                    setInfo(res.data);
                    setUuid(res.data.uuid);
                    const expirationTime = res.data.created_at + res.data.lifetime;
                    startCountdown(expirationTime);

                }).catch((err) => {
                    showError(err.response.data.message)
                })
            }
        } else {
            showError("Amount is very low")
        }
    };

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const res = await API.get('/api/user/getcurrencies');
                setCurrencies(res.data)
                const tempItems = res.data.map(item => item.currency + " / " + item.network)
                setItems(tempItems)
                setSelectedItem(items[0])
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };

        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (uuid) {
            const checkTransactionStatus = async () => {
                try {
                    const response = await API.get(`/api/transaction-status/${uuid}`);
                    if (response.data.status == "success") {
                        window.location.href = response.data.redirect_url;
                    }
                } catch (error) {
                    console.error("Error checking transaction status:", error);
                }
            };

            // Poll every 5 seconds
            const interval = setInterval(checkTransactionStatus, 3000);
            return () => clearInterval(interval);
        }
    }, [uuid]);

    useEffect(() => {
        // Perform side effects when selectedItem changes
        if (selectedItem !== null && selectedItem !== undefined) {
            const [selected_currency, selected_network] = selectedItem.split(' / ')
            const currency = currencies.find(item => item.currency === selected_currency && item.network === selected_network)
            if (currency !== undefined) {
                setMin(currency.min_amount)
                setEst(currency.conversion_rate * input)
            }

        }
        if (!items.find(item => item == selectedItem)) {
            setSelectedItem(selectedItem_prev)
        }
        else {
            selectedItem_prev = selectedItem
        }
    }, [selectedItem]);

    useEffect(() => {
        setInput(Math.max(0, input))
    }, [input])


    return (
        <div className='flex'>
            <div className="md:mt-0 md:w-1/2 text-sm bg-white text-black">
                <div className="border-0">
                    <div className="px-4 py-4">
                        <div className="w-full text-sm">
                            <div className="w-100 d-flex justify-content-between gap-2">
                                <div className="">
                                    <label className='mb-2'>Crypto currencies</label>
                                    <Select className='w-100'
                                        placeholder="Choose"
                                        onChange={(value) => {
                                            setSelectedItem(value.target.value);
                                        }}
                                        value={selectedItem}
                                        optionList={items}
                                        getPopupContainer={() => document.querySelector('.modal-content')}
                                    />
                                </div>
                                <div className="">
                                    <div className="personalInput w-100">
                                        <label>Input Amount (USD)</label>
                                        <input type="number" className="search-input" value={input} onChange={inputChangeHandler} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-100 d-flex justify-content-between gap-2">
                            <div className="personalInput w-100">
                                <label>Min Amount (Coin)</label>
                                <input type="number" className="search-input" value={min} readOnly />
                            </div>
                            <div className="personalInput w-100">
                                <label>Estimated Amount (Coin)</label>
                                <input type="number" className="search-input" value={est} readOnly />
                            </div>
                        </div>
                        <div className="mt-10 px-4 py-4">
                            <p className="text-lg font-semibold">Guide</p>
                            <p className="text-sm py-1">
                                <i className="mdi mdi-check"></i> Please sends coins with the transfer information.
                            </p>
                            <p className="text-sm py-1">
                                <i className="mdi mdi-check"></i> After sends coins, system will processes and exchanges them, and settles the payment to your balance.
                            </p>
                        </div>
                        <div className="d-flex mt-4 w-100 align-items-center justify-content-center">
                            <div className="button-group mt-3">
                                <div onClick={createTransactionHandle} className="btn btn-redeem">Create Transaction</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="md:mt-0 md:w-1/2 text-sm bg-white text-black">
                {info !== null && (
                    <div className="px-2">
                        <div className="px-4 py-4">
                            <div className="flex flex-col">
                                <div className="w-full">
                                    <p className="text-lg font-semibold">Transaction Information</p>
                                    <div className="text-sm">
                                        <p className="py-1">
                                            Price: {info?.amount} {info?.currency}
                                        </p>
                                        <p className="py-1">
                                            Amount: {info?.pay_amount} {info?.pay_currency}
                                        </p>
                                        <div className="py-1 flex items-center">
                                            Address:
                                            <span>{info?.address}</span>
                                            <button
                                                onClick={() => copyText(info?.address)}
                                                className="ml-2"
                                            >
                                                <i className="fas fa-copy"></i>
                                            </button>
                                        </div>
                                        {timeLeft !== null && (
                                            <p className="py-1">
                                                Time Left: {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <img src={info?.qrCode} className="w-1/2 qr" alt="QR Code" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default CryptoModel;
