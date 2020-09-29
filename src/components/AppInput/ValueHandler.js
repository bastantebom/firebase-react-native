import VF from '@/components/AppInput/ValidationFunctions';

export default valueHandler = async (
  value,
  validation,
  valueName,
  errors,
  setErrors,
) => {
  if (!errors || !setErrors || !valueName) {
    return console.log('MISSING PARAMETERS');
  }

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
};
