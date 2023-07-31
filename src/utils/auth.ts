
const TOKEN_KEY = "token";
const INVITE_KEY = "isInvite";
const ACC_KEY = "account";

const isLogin = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string,) => {
    localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
    localStorage.removeItem(INVITE_KEY);
};

const getInvite = () => {
    return localStorage.getItem(INVITE_KEY);
};

const setInvite = (Invite: string) => {
    localStorage.setItem(INVITE_KEY, Invite);
};

const clearInvite = () => {
    localStorage.removeItem(INVITE_KEY);
};
const getACC_KEY = () => {
    return localStorage.getItem(ACC_KEY);
};

const setACC_KEY = (account: string) => {
    localStorage.setItem(ACC_KEY, account);
};

const clearACC_KEY = () => {
    localStorage.removeItem(ACC_KEY);
};

const clearAll = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INVITE_KEY);
    // localStorage.removeItem(ACC_KEY);
    localStorage.removeItem("wallet_addr");
    localStorage.removeItem("percentageLogin");
    // localStorage.removeItem("user_name");
    // localStorage.removeItem("description");
};


export {
    isLogin,
    getToken,
    setToken,
    clearToken,
    getInvite,
    setInvite,
    clearInvite,
    getACC_KEY,
    clearACC_KEY,
    setACC_KEY,
    clearAll,
};