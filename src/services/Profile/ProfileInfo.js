import BaseAPI from '@/services/BaseAPI';
import {UserContext} from '@/context/UserContext';

const getUser = async (payload) => {
  return await BaseAPI({
    url: 'user/' + payload,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const updateUser = (payload, UID) => {
  return BaseAPI({
    url: `user/update/${UID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const updatePassword = (payload, UID) => {
  return BaseAPI({
    url: `user/change-password/${UID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const ProfileInfoService = {
  getUser,
  updateUser,
  updatePassword,
};

export default ProfileInfoService;
