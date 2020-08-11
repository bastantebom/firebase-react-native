import BaseAPI from '@/services/BaseAPI';

const createPost = (payload) => {
  // console.log('creating post...');
  // console.log('post data: ');
  // console.log(payload);

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
}

const PostService = {createPost, editPost};

export default PostService;
