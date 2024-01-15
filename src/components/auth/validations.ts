export const validatePasswordLength = (password: string) => {
    return !!password && password.length > 7;
};

export const validateEmailFormat = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !!email && re.test(String(email).toLowerCase());
};

export const validateNameFormat = (name: string) => {
    const re = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    return !!name && re.test(String(name));
};

export const validateUsernameFormat = (username: string) => {
    const re = /^[a-zA-Z0-9_\.]{3,16}$/;
    return !!username && re.test(String(username));
};

export const validatePhoneFormat = (phone: string) => {
    const re = /^\+\d{3}(\d{2})(\d{3})(\d{2})(\d{2})$/;
    return !!phone && re.test(String(phone));
};

export const validateGroupFormat = (username: string) => {
    const re = /^[a-zA-Z0-9_]{3,16}$/;
    return !!username && re.test(String(username));
};