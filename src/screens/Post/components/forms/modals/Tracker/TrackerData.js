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

export const generateStatus = (status, type, seller) => {
  const sellStatuses = {
    pending: {
      title: 'Awaiting Confirmation',
      message: seller
        ? "Don't forget to check details before confirming your customer's order"
        : 'Got your order request, Buzzybee!',
      animation: pending,
    },
    confirmed: {
      title: seller ? 'Processing' : 'Order Confirmed',
      message: seller
        ? 'Bee ready! '
        : 'Bee patient, seller’s processing your order.',
      animation: inProgress,
      withGradient: true,
    },
    paid: {
      title: seller ? 'Processing' : 'Order Confirmed',
      message: seller
        ? 'Bee ready! '
        : 'Bee ready! Your order is now being processed. ',
      animation: inProgress,
      withGradient: true,
    },
    delivering: {
      title: 'Delivering',
      message: seller
        ? 'Delivering Bee on the lookout, your delivery is on its way to the customer.'
        : 'Your order will be buzzing at your doorstep in a bit!',
      animation: delivering,
      withGradient: true,
    },
    completed: {
      title: 'Completed',
      message: seller
        ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees. "
        : 'All good? Tell us all about your experience. ',
      animation: seller ? sellerOrderCompleted : customerOrderCompleted,
    },
    pickup: {
      title: 'Pick Up',
      message: seller
        ? 'All set! Awaiting for customer to pick up the order.'
        : 'BUZZ! Your order is waiting for you.',
      animation: pickup,
    },
    cancelled: {
      title: 'Cancelled',
      message: seller
        ? 'Sorry, the buyer cancelled their order.'
        : "Unfortunately, the buyer cancelled their order. Don't worry. Just keep on hustling.",
      animation: customerOrderCancelled,
    },
    declined: {
      title: 'Declined',
      message: seller
        ? 'You declined the transaction.'
        : 'It seems your order cannot be processed. Please check with the SELLER.',
      animation: orderDeclined,
    },
    pendingPayment: {
      title: 'Awaiting Payment',
      message: seller
        ? 'Just waiting for the customer to complete the payment.'
        : 'Last step! Once the payment is complete the order will be processed.', //need copy
      animation: awaitingPayment,
    },
  }

  const needStatuses = {
    pending: {
      title: 'Awaiting Confirmation',
      message: seller
        ? "Don't forget to check details before confirming your customer's order"
        : 'Got your order request, Buzzybee!',
      animation: pending,
    },
    completed: {
      title: 'Completed',
      message: seller
        ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees. "
        : 'All good? Tell us all about your experience. ',
      animation: customerOrderCompleted,
    },
    declined: {
      title: 'Declined',
      message: seller
        ? 'You declined the request.'
        : 'Uh-oh. Your order was declined.',
      animation: sellerServiceCancelled,
    },
  }

  const serviceStatuses = {
    pending: {
      title: 'Awaiting Confirmation',
      message: seller
        ? 'Please review booking details and click CONFIRM to proceed. '
        : 'Reviewing your booking request. ',
      animation: pending,
    },
    confirmed: {
      title: 'Schedule Confirmed',
      message: 'Booked! Please bee on time for your appointment.',
      animation: bookingScheduled,
    },
    paid: {
      title: 'Schedule Confirmed',
      message: 'Booked! Please bee on time for your appointment.',
      animation: bookingScheduled,
    },
    completed: {
      title: 'Completed',
      message: seller
        ? "Transaction completed! Thank you for your beezness! We're happy to be of Servbees. "
        : 'All good? Tell us all about your experience. ',
      animation: sellerOrderCompleted,
      withGradient: true,
    },
    cancelled: {
      title: 'Cancelled',
      message: seller
        ? "Unfortunately, the buyer cancelled their order. Don't worry. Just keep on hustling."
        : 'Luh. Cancelled?! Chat with the Service Provider for details.',
      animation: sellerServiceCancelled,
    },
    declined: {
      title: 'Declined',
      message: seller
        ? 'You declined the transaction.'
        : 'Uh-oh. Try checking with the service provider or look for other options on Servbees.',
      animation: sellerServiceCancelled,
    },
    pendingPayment: {
      title: 'Awaiting Payment',
      message: seller
        ? 'Just waiting for the customer to complete the payment.'
        : 'Confeeermed! Please settle payment to complete your booking. ',
      animation: bookingScheduled,
    },
  }

  switch (type) {
    case 'sell':
      return sellStatuses[status]
    case 'need':
      return needStatuses[status]
    case 'service':
      return serviceStatuses[status]
    default:
      return
  }
}
