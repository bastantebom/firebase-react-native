import BaseAPI from '@/services/BaseAPI'

const reportUser = async payload => {
  //url: /users/:reported_uid/report
  //reported_uid
  return BaseAPI({
    url: `/users/${payload.reported_uid}/report`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const blockUser = async payload => {
  ///users/:reported_uid/block
  return BaseAPI({
    url: `/users/${payload.reported_uid}/block`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const unBlockUser = async payload => {
  //url: /users/:reported_uid/unblock
  return BaseAPI({
    url: `/users/${payload.reported_uid}/unblock`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const contactServbees = async payload => {
  //url: /users/:reported_uid/unblock
  ////POST
  //body: { full_name, email, message}
  return BaseAPI({
    url: `contact-us`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const AdminFunctionService = {
  reportUser,
  blockUser,
  unBlockUser,
  contactServbees,
}

export default AdminFunctionService
