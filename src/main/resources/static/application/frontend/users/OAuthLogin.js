var OAuthLogin = (props) => {

    if(location.search) {

        const urlParams = new URLSearchParams(location.search.substring(1));
        const code = urlParams.get("code");
        // FIXME.
        // Get codeVerifier from sessionStorage.
        const codeVerifier = '';

        // FIXME.
        // Remove codeVerifier from sessionStorage.

        if (code && codeVerifier) {

            const tokenParams = new Map();

            tokenParams.set('grant_type', 'authorization_code');
            // FIXME.
            // Add rest of parameters to make the request to the token endpoint.

            oauthService.getToken(tokenParams,
                response => {
                    const accessToken = response.access_token;
                    const jwtToken = jwt.parseJwtToken(accessToken);
                    jwt.storeJwtToken(accessToken);
                    props.dispatch({
                        type: 'login',
                        user: jwtToken.sub,
                        roles: jwtToken.roles,
                        token: accessToken
                    });
                },
                () => {
                    alerts.error('Access denied!');
                });

        }

        return (<ReactRouterDOM.Redirect to="/"/>);

    }

    alerts.error('Access denied!');
    return (<ReactRouterDOM.Redirect to="/"/>);

};

OAuthLogin = ReactRedux.connect()(OAuthLogin);