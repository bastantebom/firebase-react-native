const usernameValidator = async (username) => {
  let userNameReg = /^[a-z0-9.-]*$/;
  username = username.toLowerCase();

  return await new Promise((resolve, reject) => {
    if (!(username.length >= 2)) {
      reject('Username must be at least 2 characters');
    }

    if (!(username.length <= 16)) {
      reject('Username must be less than, or 16 characters');
    }

    if (!userNameReg.test(username)) {
      reject('Username must only use letters, numbers, dash(-), and dot(.)');
    }

    // passed
    return resolve(true);
  });
};

const emailValidator = async (email) => {
  let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return await new Promise((resolve, reject) => {
    if (email === '') {
      reject('Email is required.');
    }
    if (!emailReg.test(email)) {
      reject('Invalid email address.');
    }

    return resolve(true);
  });
};

const MobileNumberValidator = async (number) => {
  let mobileReg = /^(09|\+639)\d{9}$/;

  return await new Promise((resolve, reject) => {
    if (!mobileReg.test(number)) {
      reject('Please put a valid 11 digit mobile number.');
    }

    return resolve(true);
  });
};

const PasswordValidator = async (password) => {
  return await new Promise((resolve, reject) => {
    if (password.length < 6) {
      reject('Password must be 6 characters or more.');
    }

    return resolve(true);
  });
};

const NameValidator = async (name) => {
  var nameReg = /^[a-zA-Z\s]*$/;

  return await new Promise((resolve, reject) => {
    if (name === '') {
      reject('Full name is required.');
    }

    if (!nameReg.test(name)) {
      reject('Invalid name. (Letters & spaces only.)');
    }

    return resolve(true);
  });
};

const DisplayNameValidator = async (display_name) => {
  return await new Promise((resolve, reject) => {
    if (display_name.length > 28) {
      reject('Display name must be less than 28 characters.');
    }

    return resolve(true);
  });
};

const Validator = {
  usernameValidator,
  emailValidator,
  MobileNumberValidator,
  PasswordValidator,
  NameValidator,
  DisplayNameValidator,
};

export default Validator;
