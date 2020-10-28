import BaseAPI from '@/services/BaseAPI'
import { ProfileInfoService } from '@/services'

const getPosts = async payload => {
  //?limit=5&page=0
  // console.log(`posts?limit=${payload.limit}&page=${payload.page}`);
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
        price: post.is_multiple ? '' : post.items[0].price,
        user: (await ProfileInfoService.getUser(post.uid)).data,
      }))
    ),
  }
}

const searchPosts = payload => {
  //?limit=5&page=0
  // console.log(`posts?limit=${payload.limit}&page=${payload.page}`);
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
  //?limit=5&page=0
  // console.log(`posts?limit=${payload.limit}&page=${payload.page}`);
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
  //users/:uid/posts
  //  console.log(
  //   `users/${payload.uid}/posts?limit=${payload.limit}&page=${payload.page}`
  //  );
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
        price: post.is_multiple ? '' : post.items[0].price,
        user: (await ProfileInfoService.getUser(post.uid)).data,
      }))
    ),
  }
}

const getPostsLocation = payload => {
  // console.log(
  //   `posts?limit=${payload.limit}&page=${payload.page}&city=${payload.city}`,
  // );
  return BaseAPI({
    url: `posts?limit=${payload.limit}&page=${payload.page}&city=${payload.city}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    //data: payload,
  })
}

const createPost = payload => {
  //console.log(payload);
  return BaseAPI({
    url: '/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const editPost = (PID, payload) => {
  /**
   * Accepts Post ID and payload
   */
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
  /**
   * Accepts Post ID
   */
  return BaseAPI({
    url: `posts/${PID}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const hidePost = payload => {
  /**
   * Accepts Post ID
   * UID
   */
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
  /**
   * Accepts Post ID
   * UID
   */

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
  /**
   * Accepts Post ID
   * UID
   */
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
  /**
   * Accepts Post ID
   * UID
   */
  return BaseAPI({
    url: `/posts/${PID}`,
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
}

export default PostService
