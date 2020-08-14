import BaseAPI from '@/services/BaseAPI';

const getPosts = async (UID, limit, last_pid = '') => {
  return await BaseAPI({
    url: `post/${UID}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      limit: limit,
      last_pid: last_pid,
    },
  });
};

const createPost = async (payload) => {
  return await BaseAPI({
    url: 'post/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const editPost = async (PID, payload) => {
  /**
   * Accepts Post ID and payload
   */
  return await BaseAPI({
    url: `post/edit/${PID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const deletePost = async (PID) => {
  /**
   * Accepts Post ID
   */
  return await BaseAPI({
    url: `post/delete/${PID}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const PostService = {createPost, editPost, deletePost};

export default PostService;
