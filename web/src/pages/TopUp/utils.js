import { API } from '../../helpers';

export const createPaymentIntent = async (paymentIntent) => {
  try {
    const intentData = await API.post('/api/user/intent/create', paymentIntent);
    return intentData.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
