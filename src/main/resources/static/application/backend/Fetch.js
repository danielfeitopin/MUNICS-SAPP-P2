const doFetch = (url, data, onSuccess, onError) => {
    var headers = {
        'Content-Type': 'application/json'
    };
    if(data.token) {
        headers['Authorization'] = 'Bearer ' + data.token;
    }
    fetch(url, {
        'method': data.method ? data.method : 'get',
        'body': data.body ? JSON.stringify(data.body) : null,
        'headers': headers
    }).then(function(response) {
        var expectedCode = data.status ? data.status : 200;
        if(response.status < 400 && expectedCode !== response.status) {
            throw new Error('Internal error while executing operation!');
        }
        if(response.status === 201) {
            var headers = {};
            response.headers.forEach((val, key) => {
                if(key === 'location') {
                    headers[key] = val;
                }
            });
            return headers;
        }
        var contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            var contentLength = response.headers.get("content-length");
            if(response.status === 204 || contentLength && contentLength === '0') {
                return {};
            } else {
                throw new Error('Internal error while executing operation!');
            }
        }
    }).then(function(data) {
        if(data.status && data.status >= 400) {
            if(onError) {
                onError(data);
            } else {
                alerts.error(data.message);
            }            
        } else if(onSuccess) {
            onSuccess(data);
        }
    }).catch(function(err) {
        if(onError) {
            onError(err);
        } else {
            alerts.error(err, 'Error');
        }
    });
};
