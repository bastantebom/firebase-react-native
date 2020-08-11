import BaseAPI from '@/services/BaseAPI';

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

const PostService = {createPost};

export default PostService;
