import VF from '@/components/AppInput/ValidationFunctions';

export default valueHandler = async (
  value,
  validation,
  valueName,
  errors,
  setErrors,
  setValue,
  uid,
) => {
  if (validation === '') {
    return setValue(value);
  } else {
    setValue(value);
  }

  if (!errors || !setErrors || !valueName || typeof setValue !== 'function') {
    return console.log('MISSING PARAMETERS');
  }

  if (validation === 'display_name')
    await VF.DisplayNameValidator(value)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });

  if (validation === 'display_name')
    await VF.DisplayNameValidator(value)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });

  if (validation === 'number')
    await VF.MobileNumberValidator(value)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });

  if (validation === 'email')
    await VF.emailValidator(value)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });

  if (validation === 'name')
    await VF.NameValidator(value)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });

  if (validation === 'password')
    await VF.PasswordValidator(value)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });

  if (validation === 'username') {
    setValue(value.toLowerCase());
    await VF.usernameValidator(value, uid)
      .then(() => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: true,
            shown: false,
            message: '',
          },
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [valueName]: {
            passed: false,
            shown: true,
            message: err,
          },
        });
      });
  }
};
