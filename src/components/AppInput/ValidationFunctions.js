const usernameValidator = async (username) => {
  let userNameReg = /^[a-z0-9.-]*$/;

  return await new Promise((resolve, reject) => {
    if (!(username.length >= 2)) {
      reject('Username must be at least 2 characters');
    }

    if (!(username.length <= 30)) {
      reject('Username must be less than, or 30 characters');
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

  console.log(email)
  console.log(!emailReg.test(email))

  return await new Promise((resolve, reject) => {
    if (!emailReg.test(email)) {
      console.log('invalid', email)
      reject('Invalid email address.');
    } 

    return resolve(true);
  });
};

const MobileNumberValidator = async (number) => {
  let mobileReg = /^(09|\+639)\d{9}$/;

  return await new Promise((resolve, reject) => {
    if (!mobileReg.test(number)) {
      reject('Invalid mobile number. ');
    }

    return resolve(true);
  });
};

const Validator = {
  usernameValidator,
  emailValidator,
  MobileNumberValidator
};

export default Validator;
