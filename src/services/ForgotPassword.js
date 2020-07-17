import BaseAPI from '@/services/BaseAPI';

/**
 * 
 * @param {login: "user@email.com", provider: "email | number" } payload 
 */

const forgotEmail = (payload) => {
    return BaseAPI({
        url: 'user/forgot',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(payload),
    });
};

const ForgotPasswordService = {
    forgotEmail,
};

export default ForgotPasswordService;
