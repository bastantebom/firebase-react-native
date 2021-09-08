import pending from '@/assets/animations/awaiting.json'
import inProgress from '@/assets/animations/in-progress.json'
import delivering from '@/assets/animations/delivering.json'
import paymentProcessing from '@/assets/animations/payment-processing.json'

import sellerOrderCompleted from '@/assets/animations/seller-order-completed.json'
import customerOrderCompleted from '@/assets/animations/customer-order-completed.json'
import pickup from '@/assets/animations/pickup.json'

import customerOrderCancelled from '@/assets/animations/customer-order-cancelled.json'
import orderDeclined from '@/assets/animations/order-declined.json'
import bookingScheduled from '@/assets/animations/booking-scheduled.json'
import sellerServiceCancelled from '@/assets/animations/seller-service-cancelled.json'

export const getStatusData = ({ userType, postType, orderData, past }) => {
  const statuses = {
    sell: {
      pending: {
        title:
          userType === 'seller' && !past
            ? 'Requesting'
            : 'Awaiting Confirmation',
        message:
          userType === 'seller'
            ? "Don't forget to check details before confirming your customer's order."
            : 'Got your order request, Buzzybee!',
        animation: pending,
      },
      confirmed: {
        title:
          orderData.payment_method === 'cash'
            ? userType === 'seller'
              ? 'Processing'
              : 'Order Confirmed'
            : userType === 'seller'
            ? past
              ? 'Payment Received'
              : 'Awaiting Payment'
            : 'Awaiting Payment',
        message:
          orderData.payment_method === 'cash'
            ? userType === 'seller'
              ? 'Bee ready! '
              : 'Bee ready! Your order is now being processed.'
            : userType === 'seller'
            ? 'Just waiting for the customer to  complete the payment.'
            : 'Last step! Once the payment is complete the order will be processed.',
        animation: inProgress,
        withGradient: true,
      },
      ['payment processing']: {
        title: past ? 'Payment Completed' : 'Payment Processing',
        message:
          userType === 'seller'
            ? "Please wait a little bit. We'll buzz once the customer's payment has been processed. "
            : 'Thank you. We will buzz once payment is confirmed.',
        animation: paymentProcessing,
        withGradient: true,
      },
      paid: {
        title: userType === 'seller' ? 'Processing' : 'Order Confirmed',
        message:
          userType === 'seller'
            ? 'Bee ready! '
            : 'Bee ready! Your order is now being processed.',
        animation: inProgress,
        withGradient: true,
      },
      delivering: {
        title: past ? 'Delivered' : 'Delivering',
        message:
          userType === 'seller'
            ? 'Delivering Bee on the lookout, your delivery is on its way to the customer.'
            : 'Your order will be buzzing at your doorstep in a bit!',
        animation: delivering,
        withGradient: true,
      },
      pickup: {
        title: past ? 'Picked up' : 'Pick Up',
        message:
          userType === 'seller'
            ? 'All set! Awaiting for customer to pick up the order.'
            : 'BUZZ! Your order is waiting for you.',
        animation: pickup,
      },
      completed: {
        title: 'Completed',
        message:
          userType === 'seller'
            ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees."
            : 'All good? Tell us all about your experience.',
        animation:
          userType === 'seller' ? sellerOrderCompleted : customerOrderCompleted,
      },
      cancelled: {
        title: 'Cancelled',
        message:
          orderData.cancelled_by === 'seller'
            ? 'Your order has been cancelled.'
            : 'Sorry, the Buyer cancelled the order.',
        animation: customerOrderCancelled,
      },
      declined: {
        title: 'Declined',
        message:
          userType === 'seller'
            ? 'You declined the order request.'
            : 'Your order cannot be processed at this time. Please contact the Seller.',
        animation: orderDeclined,
      },
      ['payment failed']: {
        title: 'Payment Failed',
        message:
          userType === 'seller'
            ? 'Bee ready!'
            : 'Please check and try again in a few minutes.',
        animation: inProgress,
        withGradient: true,
      },
    },
    service: {
      pending: {
        title: userType === 'seller' ? 'Requesting' : 'Awaiting Confirmation',
        message:
          userType === 'seller'
            ? 'Accept or decline the booking request.'
            : 'Reviewing your booking request.',
        animation: pending,
      },
      confirmed: {
        title:
          orderData.payment_method === 'cash'
            ? 'Schedule Confirmed'
            : 'Awaiting Payment',
        message:
          orderData.payment_method === 'cash'
            ? 'Booked! Please bee on time for your appointment.'
            : userType === 'seller'
            ? 'Just waiting for the customer to complete the payment.'
            : 'Confeeermed! Please settle payment to complete your booking!',
        animation: bookingScheduled,
      },
      ['payment processing']: {
        title: past ? 'Payment Completed' : 'Payment Processing',
        message:
          userType === 'seller'
            ? "Please wait a little bit. We'll buzz once the customer's payment has been processed. "
            : 'Last step! Once the payment is complete the order will be processed.',
        animation: paymentProcessing,
        withGradient: true,
      },
      paid: {
        title: 'Schedule Confirmed',
        message: 'Booked! Please bee on time for your appointment.',
        animation: bookingScheduled,
      },
      completed: {
        title: 'Completed',
        message:
          userType === 'seller'
            ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees. "
            : 'All good? Tell us all about your experience.',
        animation: sellerOrderCompleted,
        withGradient: true,
      },
      cancelled: {
        title: 'Cancelled',
        message:
          orderData.cancelled_by === 'seller'
            ? 'Sorry, the Service Provider cancelled this booking.'
            : 'Sorry. This booking has been cancelled.',
        animation: sellerServiceCancelled,
      },
      declined: {
        title: 'Declined',
        message:
          userType === 'seller'
            ? 'You declined the transaction.'
            : 'Try checking with the service provider or check other options.',
        animation: sellerServiceCancelled,
      },
      ['payment failed']: {
        title: 'Payment Failed',
        message:
          userType === 'seller'
            ? 'Bee ready!'
            : 'Please check and try again in a few minutes.',
        animation: inProgress,
        withGradient: true,
      },
    },
    need: {
      pending: {
        title: 'Awaiting Confirmation',
        message:
          userType === 'seller'
            ? 'Confirm or decline the offer.'
            : 'Customer is reviewing your offer.',
        animation: pending,
      },
      confirmed: {
        title:
          orderData.payment_method === 'cash'
            ? 'Offer Confirmed'
            : 'Awaiting Payment',
        message:
          orderData.payment_method === 'cash'
            ? 'Bee ready! Your order is now being processed. '
            : userType === 'seller'
            ? 'Just waiting for the customer to complete the payment.'
            : 'Confeeermed! Please settle payment to complete your booking!',
        animation: pending,
      },
      ['payment processing']: {
        title: past ? 'Payment Completed' : 'Payment Processing',
        message:
          userType === 'seller'
            ? "Please wait a little bit. We'll buzz once the customer's payment has been processed. "
            : "Please wait a bit, we're working on it! ",
        animation: paymentProcessing,
        withGradient: true,
      },
      paid: {
        title: 'Offer Confirmed',
        message:
          userType === 'seller'
            ? 'Bee ready! Your order is now being processed.'
            : 'Payment completed, booking is good to go!',
        animation: inProgress,
        withGradient: true,
      },
      completed: {
        title: 'Offer Completed',
        message:
          userType === 'seller'
            ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees."
            : 'Payment completed, booking is good to go! ',
        animation: pending,
      },
      cancelled: {
        title: 'Offer Cancelled',
        message:
          orderData.cancelled_by === 'seller'
            ? 'Sorry. This offer has been cancelled.'
            : 'Sorry, the customer will no longer take the offer.',
        animation: pending,
      },
      declined: {
        title: 'Offer Declined',
        message:
          userType === 'seller'
            ? 'Feel free to review other offers and see what fits your needs best.'
            : 'Sorry, the customer declined the offer.',
        animation: pending,
      },
      ['payment failed']: {
        title: 'Payment Failed',
        message:
          userType === 'seller'
            ? 'Bee ready!'
            : 'Please check and try again in a few minutes.',
        animation: inProgress,
        withGradient: true,
      },
    },
  }

  return statuses[postType][orderData.status]
}

export default getStatusData
