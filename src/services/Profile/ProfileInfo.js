import BaseAPI from '@/services/BaseAPI'

const getUser = async payload => {
  return await BaseAPI({
    url: `users/${payload}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const updateUser = (payload, UID) => {
  return BaseAPI({
    url: `users/${UID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const updatePassword = (payload, UID) => {
  return BaseAPI({
    url: `users/${UID}/change-password`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const validateUsername = payload => {
  return BaseAPI({
    url: `users/verify-username`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const validateCurrentPassword = payload => {
  return BaseAPI({
    url: `users/verify-password`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const follow = (uid, follow) => {
  const connect = follow ? 'unfollow' : 'follow'
  return BaseAPI({
    url: `users/${uid}/${connect}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getFollowers = async uid => {
  return await BaseAPI({
    url: `/users/${uid}/followers`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getFollowing = async uid => {
  return await BaseAPI({
    url: `/users/${uid}/following`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const updateTemp = async payload => {
  return await BaseAPI({
    url: `/users/${payload.uid}/temperature`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const getLikedPost = async payload => {
  return await BaseAPI({
    url: `/users/${payload.uid}/posts/liked?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getArchivedPost = async payload => {
  return await BaseAPI({
    url: `/users/${payload.uid}/posts/archived?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getStatus = async uid => {
  return await BaseAPI({
    url: `/users/${uid}/status`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

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
  getLikedPost,
  getArchivedPost,
  getStatus,
}

export default ProfileInfoService
