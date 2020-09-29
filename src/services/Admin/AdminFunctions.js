import BaseAPI from '@/services/BaseAPI';

const reportUser = async (payload) => {
  return BaseAPI({
    url: `/user/report`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const blockUser = async (payload) => {
  return BaseAPI({
    url: `/user/block`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

const AdminFunctionService = {
  reportUser,
  blockUser,
};

export default AdminFunctionService;
