const projectService = {
    findProjectById : (id, data, onSuccess, onError) => {
        doFetch('api/projects/' + encodeURIComponent(id), data, onSuccess, onError);
    },

    createProject : (data, onSuccess, onError) => {
        doFetch('api/projects', $.extend({}, data, { method: 'post', status: 201 }), (headers) => {
            doFetch(headers.location, $.extend({}, data, { method: 'get', body: null, status: 200 }), 
                    onSuccess, onError);
        }, onError);
    },

    updateProjectById : (id, data, onSuccess, onError) => {
        doFetch('api/projects/' + encodeURIComponent(id), $.extend(data, {method: 'put'}), onSuccess, onError);
    },

    removeProjectById : (id, data, onSuccess, onError) => {
        doFetch('api/projects/' + encodeURIComponent(id), 
            $.extend(data, {method: 'delete', status: 204}), onSuccess, onError);
    },

    findProjects : (data, onSuccess, onError) => {
        doFetch('api/projects', data, onSuccess, onError);
    },

    findProjectTasksById : (id, data, onSuccess, onError) => {
        doFetch('api/projects/' + encodeURIComponent(id) + '/tasks', data, onSuccess, onError);
    }
};