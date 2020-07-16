import BaseAPI from '@/services/BaseAPI';

const createUser = (payload) => {
  return BaseAPI({
    url: 'user/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const getAll = () => {
  return BaseAPI({
    url: 'users',
    method: 'GET',
  });
};

const SignUpService = {
  createUser,
  getAll,
};

export default SignUpService;
