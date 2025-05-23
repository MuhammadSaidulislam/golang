import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { createPaymentIntent } from './utils';
import { createElement, init } from '@airwallex/components-sdk';
import { useNavigate } from 'react-router-dom';
import { API } from '../../helpers';

const AirwallexModel = () => {
  const [amount, setAmount] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [liveAirwallex, setLiveAirwallex] = useState(false); // Track live/demo mode
  const navigate = useNavigate();

  // Fetch LiveAirwallex flag on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await API.get('/api/option/');
        const { success, data } = res.data;
        if (success) {
          const option = data.find((item) => item.key === 'LiveAirwallex');
          setLiveAirwallex(option?.value === 'true'); // Convert to boolean
        }
      } catch (error) {
        console.error('Failed to fetch Airwallex environment setting', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const loadDropInElement = async () => {
      try {
        const env = liveAirwallex ? 'production' : 'demo';
        await init({ env, enabledElements: ['payments'] });

        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) return;

        const intent = await createPaymentIntent({
          request_id: uuid(),
          merchant_order_id: uuid(),
          amount: numericAmount,
          currency: 'USD',
          order: {
            products: [
              {
                url: 'https://via.placeholder.com/503x570',
                name: 'Charge',
                desc: 'For charge',
                unit_price: numericAmount,
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
        });
        const { id, client_secret, currency } = intent;
        const element = await createElement('dropIn', {
          intent_id: id,
          client_secret,
          currency,
          style: { popupWidth: 400, popupHeight: 549 },
        });

        element?.mount('dropIn');

        // Attach event listeners
        const onSuccess = (event) => {
          navigate('/checkout-success');
        };

        const onError = (event) => {
          console.error('There is an error', event.detail.error);
        };

        document.getElementById('dropIn')?.addEventListener('onSuccess', onSuccess);
        document.getElementById('dropIn')?.addEventListener('onError', onError);
      } catch (error) {
        console.error(error);
      }
    };

    if (isConfirmed && amount) {
      loadDropInElement();
    }
  }, [isConfirmed, amount, navigate, liveAirwallex]); // Depend on liveAirwallex

  return (
    <div className='w-100'>

      <div className="personalInput w-100">
        <label>Enter Amount (USD):</label>
        <input type="number" className="search-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
      </div>

      <div className="button-group mt-3">
        <div onClick={() => setIsConfirmed(true)} className="btn btn-redeem">Confirm Payment</div>
      </div>


      <div id="dropIn" style={{ width: '540px', margin: '48px auto' }} />
    </div>
  );
};

export default AirwallexModel;
