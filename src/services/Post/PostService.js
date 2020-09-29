import BaseAPI from '@/services/BaseAPI';

const getPosts = (payload) => {
  return BaseAPI({
    url: `post`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const getUserPosts = (payload) => {
  return BaseAPI({
    url: `post/user`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const getPostsLocation = (payload) => {
  return BaseAPI({
    url: `post/location`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const createPost = (payload) => {
  return BaseAPI({
    url: 'post/create',
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
    url: `post/edit/${PID}`,
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
    url: `post/delete/${PID}`,
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
    url: '/post/hide',
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
    url: '/post/report',
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
};

export default PostService;
