import React, { useEffect, useState } from 'react';
import { API, showError, showInfo } from '../../helpers';
import copy from 'clipboard-copy';
import { useNavigate } from 'react-router-dom';

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
                            <div className="flex justify-between px-0 py-0 my-2">
                                <p>Crypto currencies</p>
                                <p>Input Amount (USD)</p>
                            </div>
                            <div className="flex">
                                <div className="w-1/2">
                                    <select
                                        value={selectedItem}
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                        className="w-full border border-gray-300 rounded text-sm p-2 bg-white text-black"
                                    >
                                        <option value="" disabled>
                                            Select
                                        </option>
                                        {items.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-1/2 ml-5">
                                    <input
                                        type="number"
                                        value={input}
                                        onChange={inputChangeHandler}
                                        className="w-full border border-gray-300 rounded text-sm p-2 bg-white text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full text-sm mt-4">
                            <div className="flex justify-between px-0 py-0 my-2">
                                <p>Min Amount (Coin)</p>
                                <p>Estimated Amount (Coin)</p>
                            </div>
                            <div className="flex">
                                <div className="w-1/2">
                                    <input
                                        type="number"
                                        value={min}
                                        readOnly
                                        className="w-full border border-gray-300 rounded text-sm p-2 bg-gray-100 text-black"
                                    />
                                </div>
                                <div className="w-1/2 ml-5">
                                    <input
                                        type="number"
                                        value={est}
                                        readOnly
                                        className="w-full border border-gray-300 rounded text-sm p-2 bg-gray-100 text-black"
                                    />
                                </div>
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
                        <div className="flex mt-4">

                            <div className="w-1/2 flex justify-center items-end">
                                <button
                                    onClick={createTransactionHandle}
                                    className="bg-black text-white mt-2 text-xs shadow-lg px-4 py-2 rounded"
                                >
                                    Create Transaction
                                </button>
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
        </div>
    );
};

export default CryptoModel;
