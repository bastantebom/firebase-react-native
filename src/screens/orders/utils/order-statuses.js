import pending from '@/assets/animations/awaiting.json'
import inProgress from '@/assets/animations/in-progress.json'
import delivering from '@/assets/animations/delivering.json'

import sellerOrderCompleted from '@/assets/animations/seller-order-completed.json'
import customerOrderCompleted from '@/assets/animations/customer-order-completed.json'
import pickup from '@/assets/animations/pickup.json'

import customerOrderCancelled from '@/assets/animations/customer-order-cancelled.json'
import orderDeclined from '@/assets/animations/order-declined.json'
import awaitingPayment from '@/assets/animations/awaiting-payment.json'
import bookingScheduled from '@/assets/animations/booking-scheduled.json'
import sellerServiceCancelled from '@/assets/animations/seller-service-cancelled.json'

export const getStatusData = ({
  userType,
  type,
  status,
  paymentMethod,
  past,
}) => {
  const statuses = {
    sell: {
      pending: {
        title:
          userType === 'seller' ? 'Requesting...' : 'Awaiting Confirmation',
        message:
          userType === 'seller'
            ? "Don't forget to check details before confirming your customer's order"
            : 'Got your order request, Buzzybee!',
        animation: pending,
      },
      confirmed: {
        title:
          paymentMethod === 'cash'
            ? userType === 'seller'
              ? 'Processing'
              : 'Order Confirmed'
            : userType === 'seller'
            ? past
              ? 'Payment Received'
              : 'Awaiting Payment'
            : 'Awaiting Payment',
        message:
          paymentMethod === 'cash'
            ? userType === 'seller'
              ? 'Bee ready! '
              : 'Your order is now being prepared...'
            : userType === 'seller'
            ? 'Just waiting for the customer to  complete the payment.'
            : 'Last step! Once the payment is complete the order will be processed.',

        animation: inProgress,
        withGradient: true,
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
      ['payment processing']: {
        title: 'Payment Processing',
        message:
          userType === 'seller'
            ? "Please wait a little bit. We'll buzz once the customer's payment has been processed."
            : 'Thank you. We will buzz once payment is confirmed.',
        animation: inProgress,
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
        title: 'Delivering',
        message:
          userType === 'seller'
            ? 'Delivering Bee on the lookout, your delivery is on its way to the customer.'
            : 'Your order will be buzzing at your doorstep in a bit!',
        animation: delivering,
        withGradient: true,
      },
      completed: {
        title: 'Completed',
        message:
          userType === 'seller'
            ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees. "
            : 'All good? Tell us all about your experience. ',
        animation:
          userType === 'seller' ? sellerOrderCompleted : customerOrderCompleted,
      },
      pickup: {
        title: 'Pick Up',
        message:
          userType === 'seller'
            ? 'All set! Awaiting for customer to pick up the order.'
            : 'BUZZ! Your order is waiting for you.',
        animation: pickup,
      },
      cancelled: {
        title: 'Cancelled',
        message:
          userType === 'seller'
            ? 'Sorry, the buyer cancelled their order.'
            : 'Sorry, the seller cancelled the order. ',
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
      pendingPayment: {
        title: 'Awaiting Payment',
        message:
          userType === 'seller'
            ? 'Just waiting for the customer to complete the payment.'
            : 'The seller is waiting for your payment.',
        animation: awaitingPayment,
      },
    },
    service: {
      pending: {
        title:
          userType === 'seller' ? 'Requesting...' : 'Awaiting Confirmation',
        message:
          userType === 'seller'
            ? 'Confirm or decline booking...'
            : 'Reviewing your booking request. ',
        animation: pending,
      },
      confirmed: {
        title:
          paymentMethod === 'cash' ? 'Schedule Confirmed' : 'Awaiting Payment',
        message:
          paymentMethod === 'cash'
            ? 'Booked! Please bee on time for your appointment.'
            : userType === 'seller'
            ? 'Just waiting for the customer to  complete the payment.'
            : 'Confeeermed! Please settle payment to complete your booking.',
        animation: bookingScheduled,
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
      ['payment processing']: {
        title: 'Payment Processing',
        message:
          userType === 'seller'
            ? 'Payment is now being processed'
            : 'Got your payment, Buzzbee! We are now processing your payment.',
        animation: inProgress,
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
          userType === 'seller'
            ? 'Sorry. This booking has been cancelled.'
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
      pendingPayment: {
        title: 'Awaiting Payment',
        message:
          userType === 'seller'
            ? 'Just waiting for the customer to complete the payment.'
            : 'Confeeermed! Please settle payment to complete your booking. ',
        animation: bookingScheduled,
      },
    },
    need: {
      pending: {
        title: 'Awaiting Confirmation',
        message:
          userType === 'seller'
            ? 'Customer is reviewing your offer. '
            : 'Got your order request, Buzzybee!',
        animation: pending,
      },
      confirmed: {
        title: 'Offer Confirmed',
        message:
          userType === 'seller'
            ? 'Bee ready! '
            : 'Choose from the payment methods available and settle the balance to proceed. ',
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
      ['payment processing']: {
        title: 'Payment Processing',
        message:
          userType === 'seller'
            ? 'Payment is now being processed'
            : 'Got your payment, Buzzbee! We are now processing your payment.',
        animation: inProgress,
        withGradient: true,
      },
      completed: {
        title: 'Completed',
        message:
          userType === 'seller'
            ? 'Payment completed, booking is good to go! '
            : "Don't forget to rate your Service/Seller Bee!",
        animation: pending,
      },
      cancelled: {
        title: 'Cancelled',
        message:
          userType === 'seller'
            ? 'Sorry, the respondent cancelled their offer.'
            : 'Luh. Cancelled?! Chat with the Service Provider for details.',
        animation: pending,
      },
      declined: {
        title: 'Offer Declined',
        message:
          userType === 'seller'
            ? 'Feel free to review other offers and see what fits your needs best.'
            : 'Uh-oh. Try checking with the service provider or look for other options on Servbees.',
        animation: pending,
      },
    },
  }

  return statuses[type][status]
}

export default getStatusData
