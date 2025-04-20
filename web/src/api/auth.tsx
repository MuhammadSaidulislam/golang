//save jwt to local storage
export const authenticate = (data:any, next:any) => {
    if (typeof window !== undefined) {
        localStorage.setItem("company", JSON.stringify(data));
        next();
    }
};
// is authenticte
export const isAuthenticate = () => {
    if (typeof window == undefined) {
        return false;
    }
    if (localStorage.getItem("company")) {
        return JSON.parse(localStorage.getItem("company") || '{}');
    } else {
        return false;
    }
};
export const isAdminAuthenticate = () => {
    if (typeof window == undefined) {
        return false;
    }
    if (localStorage.getItem("company")) {
        return JSON.parse(localStorage.getItem("company") || '{}');
    } else {
        return false;
    }
};
// logout
export const logout = async () => {
    localStorage.removeItem("company");
};

// logout
export const adminLogout = async () => {
    localStorage.removeItem("company");
};