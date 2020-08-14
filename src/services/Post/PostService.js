import BaseAPI from '@/services/BaseAPI';

const createPost = async (payload) => {
  // console.log('creating post...');
  // console.log('post data: ');
  // console.log(payload);

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
