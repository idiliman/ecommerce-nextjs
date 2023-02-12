import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';
import { Store } from '@/utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const router = useRouter();
  console.log(selectedPaymentMethod);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  console.log(cart);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method not selected');
    }

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });

    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout>
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {['Paypal', 'Stripe', 'CashOnDelivery'].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              className="p-2 outline-none focus:ring-0"
              type="radio"
              name="paymentMethod"
              id={payment}
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}

        {/* Button */}
        <div className="mb-4 flex justify-between">
          <button
            className="default-button"
            onClick={() => router.push('/shipping')}
            type="button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

export default PaymentScreen;
