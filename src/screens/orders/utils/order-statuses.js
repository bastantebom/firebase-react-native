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
      paid: {
        title: userType === 'seller' ? 'Processing' : 'Payment Completed',
        message:
          userType === 'seller'
            ? 'Bee ready! '
            : 'Bee ready! Your order is now being processed. ',
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
            : 'Oh noooo. Try again or contact the SELLER. ',
        animation: customerOrderCancelled,
      },
      declined: {
        title: 'Declined',
        message:
          userType === 'seller'
            ? 'You declined the order request.'
            : 'It seems your order cannot be processed. Please check with the SELLER.',
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
            ? 'Please review booking details and click CONFIRM to proceed. '
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
            : 'Order completed! ',
        animation: sellerOrderCompleted,
        withGradient: true,
      },
      cancelled: {
        title: 'Cancelled',
        message:
          userType === 'seller'
            ? 'You cancelled the order.'
            : 'Luh. Cancelled?! Chat with the Service Provider for details.',
        animation: sellerServiceCancelled,
      },
      declined: {
        title: 'Declined',
        message:
          userType === 'seller'
            ? 'You declined the order'
            : 'Uh-oh. Try checking with the service provider or look for other options on Servbees.',
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
            ? "Don't forget to check details before confirming your customer's order"
            : 'Got your order request, Buzzybee!',
        animation: pending,
      },
      confirmed: {
        title: userType === 'seller' ? 'Processing' : 'Order Confirmed',
        message:
          userType === 'seller'
            ? 'Bee ready! '
            : 'Bee ready! Your order is now being processed. ',
        animation: pending,
      },
      completed: {
        title: 'Completed',
        message: 'Offer completed!',
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
        title: 'Declined',
        message:
          userType === 'seller'
            ? 'You declined the offer.'
            : 'Uh-oh. Try checking with the service provider or look for other options on Servbees.',
        animation: pending,
      },
    },
  }

  return statuses[type][status]
}

export default getStatusData
