import BaseAPI from '@/services/BaseAPI';
//import {UserContext} from '@/context/UserContext';

const getUser = async (payload) => {
  //url: /uses/:uid
  //console.log(`users/${payload}`);
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
  //url: /users/:uid/change-password
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
  //url: /users/verify-username
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
  /// users/:uid/follow
  const connect = follow ? 'follow' : 'unfollow';
  console.log(`users/${uid}/${connect}`);
  return BaseAPI({
    url: `users/${uid}/${connect}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

  });
};



const ProfileInfoService = {
  getUser,
  updateUser,
  updatePassword,
  validateUsername,
  validateCurrentPassword,
  follow,
};

export default ProfileInfoService;
