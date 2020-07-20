import BaseAPI from '@/services/BaseAPI';

const loginMobile = (payload) => {
  return BaseAPI({
    url: 'user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const LoginService = {
  loginMobile,
};

export default LoginService;
