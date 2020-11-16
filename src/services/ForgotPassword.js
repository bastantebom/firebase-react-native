import BaseAPI from '@/services/BaseAPI'

/**
 *
 * @param {login: "user@email.com", provider: "email | number" } payload
 */

const forgotEmail = payload => {
  return BaseAPI({
    url: 'users/forgot-password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const ForgotPasswordService = {
  forgotEmail,
}

export default ForgotPasswordService
