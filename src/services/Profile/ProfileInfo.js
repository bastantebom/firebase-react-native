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

const ProfileInfoService = {
  getUser,
};

export default ProfileInfoService;
