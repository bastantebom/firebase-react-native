import BaseAPI from '@/services/BaseAPI';

const createUser = (payload) => {
  return BaseAPI({
    url: 'users/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const saveSocials = (payload) => {
  return BaseAPI({
    url: 'users/save-socials',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const saveLocation = (payload) => {
  return BaseAPI({
    url: `users/${payload.uid}/save-location`,
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
  saveSocials,
};

export default SignUpService;
