import BaseAPI from '@/services/BaseAPI';
import {UserContext} from '@/context/UserContext';

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

const AdminFunctionService = {
  reportUser,
};

export default AdminFunctionService;
