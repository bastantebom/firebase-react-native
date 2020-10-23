import BaseAPI from '@/services/BaseAPI';

const getUser = async (payload) => {
  return await BaseAPI({
    url: `users/${payload}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const updateUser = (payload, UID) => {
  return BaseAPI({
    url: `users/${UID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const updatePassword = (payload, UID) => {
  return BaseAPI({
    url: `users/${UID}/change-password`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const validateUsername = (payload) => {
  return BaseAPI({
    url: `users/verify-username`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const validateCurrentPassword = (payload) => {
  return BaseAPI({
    url: `users/verify-password`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const follow = (uid, follow) => {
  const connect = follow ? 'unfollow' : 'follow';
  console.log(`users/${uid}/${connect}`);
  return BaseAPI({
    url: `users/${uid}/${connect}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getFollowers = async (uid) => {
  return await BaseAPI({
    url: `/users/${uid}/followers`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getFollowing = async (uid) => {
  return await BaseAPI({
    url: `/users/${uid}/following`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const updateTemp = async (payload) => {
  console.log(`/users/${payload.uid}/temperature`);
  return await BaseAPI({
    url: `/users/${payload.uid}/temperature`,
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
  validateUsername,
  validateCurrentPassword,
  follow,
  getFollowers,
  getFollowing,
  updateTemp,
};

export default ProfileInfoService;
