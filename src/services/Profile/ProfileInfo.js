import BaseAPI from '@/services/BaseAPI';

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
    url: 'user/update/' + UID,
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
};

export default ProfileInfoService;
