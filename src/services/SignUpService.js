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

const saveLocation = (payload) => {
  return BaseAPI({
    url: '/user/location',
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
  saveLocation,
};

export default SignUpService;
