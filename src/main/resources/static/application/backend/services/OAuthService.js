const oauthService = {
    getToken : (tokenParams, onSuccess, onError) => {

        const formData = new FormData();

        tokenParams.forEach((value, key) => formData.append(key, value));

        fetch('http://127.0.0.1:7777/oauth2/token', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (!response.ok) {
                onError();
            } else {
                response.json().then(payload => onSuccess(payload));
            }
        }).catch(error => onError());

    }
};
