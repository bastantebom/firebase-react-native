import BaseAPI from '@/services/BaseAPI';

const verifyCode = (payload) => {
  return BaseAPI({
    url: 'user/verify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const resendCode = (payload) => {
  return BaseAPI({
    url: 'send/email',
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
