import BaseAPI from '@/services/BaseAPI'
import { ProfileInfoService } from '@/services'

const getPosts = async payload => {
  const response = await BaseAPI({
    url: `posts?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { data, success } = response

  return {
    success,
    data: await Promise.all(
      data.map(async post => ({
        ...post,
        price: post.is_multiple ? '' : post?.items[0]?.price,
        user: (await ProfileInfoService.getUser(post.uid)).data,
        likers: (await getLikers(post.id)).likes,
      }))
    ),
  }
}

const searchPosts = payload => {
  return BaseAPI({
    url: '/posts',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: payload,
  })
}

const searchUsers = payload => {
  return BaseAPI({
    url: '/users',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: payload,
  })
}

const getUserPosts = async payload => {
  const response = await BaseAPI({
    url: `users/${payload.uid}/posts?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const { data, success } = response
  return {
    success,
    data: await Promise.all(
      data.map(async post => ({
        ...post,
        price: post.is_multiple ? '' : post?.items[0]?.price,
        user: (await ProfileInfoService.getUser(post.uid)).data,
      }))
    ),
  }
}

const getLikedPosts = async payload => {
  const response = await BaseAPI({
    url: `/users/${payload.uid}/posts/liked?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const { data, success } = response
  const filteredData = data.filter(i => i)
  return {
    success,
    data: await Promise.all(
      filteredData.map(async post => ({
        ...post,
        price: post?.is_multiple ? '' : post?.items[0].price,
        user: (await ProfileInfoService.getUser(post?.uid)).data,
      }))
    ),
  }
}

const getArchivedPosts = async payload => {
  const response = await BaseAPI({
    url: `users/${payload.uid}/posts/archived?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const { data, success } = response
  const filteredData = data.filter(i => i)
  return {
    success,
    data: await Promise.all(
      filteredData.map(async post => ({
        ...post,
        price: post.is_multiple ? '' : post?.items[0]?.price,
        user: (await ProfileInfoService.getUser(post.uid)).data,
      }))
    ),
  }
}

const getPostsLocation = payload => {
  return BaseAPI({
    url: `posts?limit=${payload.limit}&page=${payload.page}&city=${payload.city}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const createPost = async payload => {
  let response = await BaseAPI({
    url: '/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })

  const { data, success, message } = response

  return {
    success,
    message,
    data: {
      ...data,
      user: (await ProfileInfoService.getUser(data.uid)).data,
    },
  }
}

const editPost = (PID, payload) => {
  return BaseAPI({
    url: `posts/${PID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const deletePost = PID => {
  return BaseAPI({
    url: `posts/${PID}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const hidePost = payload => {
  return BaseAPI({
    url: `/posts/${payload.pid}/hide`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const reportPost = payload => {
  return BaseAPI({
    url: `/posts/${payload.pid}/report`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const unHidePost = payload => {
  return BaseAPI({
    url: `/posts/${payload.pid}/unhide`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const getPost = PID => {
  return BaseAPI({
    url: `/posts/${PID}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const likeUnlike = async (pid, isLike) => {
  const mark = isLike ? 'unlike' : 'like'
  return BaseAPI({
    url: `/posts/${pid}/${mark}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getLikers = async pid => {
  return BaseAPI({
    url: `/posts/${pid}/likes`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const PostService = {
  createPost,
  getPosts,
  searchPosts,
  searchUsers,
  editPost,
  deletePost,
  getPostsLocation,
  getUserPosts,
  hidePost,
  reportPost,
  unHidePost,
  getPost,
  getLikedPosts,
  getArchivedPosts,
  likeUnlike,
  getLikers,
}

export default PostService
