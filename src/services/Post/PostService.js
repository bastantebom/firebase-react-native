import BaseAPI from '@/services/BaseAPI';

const getPosts = (payload) => {
  //?limit=5&page=0
  // console.log(`posts?limit=${payload.limit}&page=${payload.page}`);
  return BaseAPI({
    url: `posts?limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getUserPosts = (payload) => {
  // users/:uid/posts
  // console.log(
  //   `posts?uid=${payload.uid}&limit=${payload.limit}&page=${payload.page}`,
  // );
  return BaseAPI({
    url: `posts/${payload.uid}/users/limit=${payload.limit}&page=${payload.page}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getPostsLocation = (payload) => {
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
  });
};

const createPost = (payload) => {
  //console.log(payload);
  return BaseAPI({
    url: '/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

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
  });
};

const deletePost = (PID) => {
  /**
   * Accepts Post ID
   */
  return BaseAPI({
    url: `posts/${PID}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const hidePost = (payload) => {
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
  });
};

const reportPost = (payload) => {
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
  });
};

const unHidePost = (payload) => {
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
  });
};

const PostService = {
  createPost,
  getPosts,
  editPost,
  deletePost,
  getPostsLocation,
  getUserPosts,
  hidePost,
  reportPost,
  unHidePost,
};

export default PostService;
