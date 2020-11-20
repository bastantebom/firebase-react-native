export default {
  //Not Env Specific
  apiKey: 'AIzaSyCu10vZtdRHmJ7bxnebSSj7u1LFeMV4GUs',
  latitudeDelta: 0.0075,
  longitudeDelta: 0.0075,

  local: {
    api: 'http://localhost:5000',
    googleSignIn:
      '960850345935-mrm0tnvd72ge68c84nee8nehh4p20l80.apps.googleusercontent.com',
  },

  dev: {
    api: 'https://servbees-api-dev.onrender.com',
    googleSignIn:
      '960850345935-mrm0tnvd72ge68c84nee8nehh4p20l80.apps.googleusercontent.com',
  },

  prod: {
    api: 'https://api.servbees.com/',
    googleSignIn:
      '78822170583-7gtfq9r1n2q25rujl2sjtq46q0sspv6d.apps.googleusercontent.com',
  },
}
