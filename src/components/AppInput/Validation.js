const validation = {
  email: {
    presence: {
      message: 'Please enter an email address',
    },
    email: {
      message: 'Please enter a valid email address',
    },
  },

  password: {
    presence: {
      message: 'Please enter a password',
    },
    length: {
      minimum: 5,
      message: 'Your password must be at least 5 characters',
    },
  },

  required: {
    presence: {
      message: 'Please enter a password',
    },
  },

  username: {
    presence: {
      message: 'Please enter a username',
    },
    length: {
        minimum: 2,
        message: 'Your username must be at least 2 characters'
    },
  },
};

export default validation;
