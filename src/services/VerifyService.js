import BaseAPI from '@/services/BaseAPI';

const verifyCode = (payload) => {
  return BaseAPI({
    url: 'users/verify-code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const resendCode = (payload) => {
  return BaseAPI({
    url: 'users/resend-code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const VerifyService = {
  verifyCode,
  resendCode,
};

export default VerifyService;
