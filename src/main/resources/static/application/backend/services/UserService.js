var userService = {
    findUsers : (data, onSuccess, onError) => {
        doFetch('api/users', data, onSuccess, onError);
    },

    login : (data, onSuccess, onError) => {
        doFetch('api/login', $.extend(data, {method: 'post'}), onSuccess, onError);
    }
    
};
