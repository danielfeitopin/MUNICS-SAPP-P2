const hasAdminRole = (roles) => {
    return roles && $.inArray('ROLE_ADMIN', roles) >= 0;
};

const jwtToken = jwt.getJwtTokenFromStorage();
const initState = jwtToken ? {
    user: jwtToken.value.sub,
    isAdmin: hasAdminRole(jwtToken.value.roles),
    token: jwtToken.valueAsString
} : {};

const getUserInfo = (state) => {
    return {
        user: state.authInfo.user,
        token: state.authInfo.token,
        isAdmin: state.authInfo.isAdmin
    };
};

registerReducer('authInfo', (state = initState, action) => {
    switch (action.type) {
        case 'login':
            return {
                user: action.user,
                isAdmin: hasAdminRole(action.roles),
                token: action.token
            };
        case 'logout':
            return {};
        default:
            return state;
    }
});
