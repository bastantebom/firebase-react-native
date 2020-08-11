import BaseAPI from '@/services/BaseAPI';

const getUser = (payload) => {
  return BaseAPI({
    url: 'user/' + payload,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const ProfileInfoService = {
  getUser,
};

export default ProfileInfoService;
