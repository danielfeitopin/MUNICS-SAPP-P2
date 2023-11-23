const jwt = {
    parseJwtToken : (tokenAsString) => {
         var base64Url = tokenAsString.split('.')[1];
         var base64 = base64Url.replace('-', '+').replace('_', '/');
         return JSON.parse(atob(base64));
    },

    storeJwtToken : (jwtTokenAsString) => {
        sessionStorage.setItem('jwtToken', jwtTokenAsString);
    },

    getJwtTokenFromStorage : () => {
        const jwtTokenAsString = sessionStorage.getItem('jwtToken');
        const jwtToken = jwtTokenAsString ? jwt.parseJwtToken(jwtTokenAsString) : null;
        if(!jwtToken) {
            return null;
        } else {
            return {
                value: jwtToken,
                valueAsString: jwtTokenAsString
            };        
        }
    },

    destroyJwtToken : () => {
        sessionStorage.removeItem('jwtToken');
    }
};


