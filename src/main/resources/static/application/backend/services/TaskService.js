const taskService = {
    findTaskById : (id, data, onSuccess, onError) => {
        doFetch('api/tasks/' + encodeURIComponent(id), data, onSuccess, onError);
    },

    createTask : (data, onSuccess, onError) => {
        doFetch('api/tasks', $.extend({}, data, { method: 'post', status: 201 }), (headers) => {
            doFetch(headers.location, $.extend({}, data, { method: 'get', body: null, status: 200 }), 
                    onSuccess, onError);
        }, onError);
    },

    updateTaskById : (id, data, onSuccess, onError) => {
        doFetch('api/tasks/' + encodeURIComponent(id), $.extend(data, {method: 'put'}), onSuccess, onError);
    },

    updateTaskStateById : (id, data, onSuccess, onError) => {
        doFetch('api/tasks/' + encodeURIComponent(id) + '/changeState' , 
            $.extend(data, {method: 'post'}), onSuccess, onError);
    },

    updateTaskResolutionById : (id, data, onSuccess, onError) => {
        doFetch('api/tasks/' + encodeURIComponent(id) + '/changeResolution' , 
            $.extend(data, {method: 'post'}), onSuccess, onError);
    },

    updateTaskProgressById : (id, data, onSuccess, onError) => {
        doFetch('api/tasks/' + encodeURIComponent(id) + '/changeProgress' , 
            $.extend(data, {method: 'post'}), onSuccess, onError);
    },

    removeTaskById : (id, data, onSuccess, onError) => {
        doFetch('api/tasks/' + encodeURIComponent(id), 
            $.extend(data, {method: 'delete', status: 204}), onSuccess, onError);
    },

    findTasks : (data, onSuccess, onError) => {
        doFetch('api/tasks', data, onSuccess, onError);
    },

    findTasksByOwner : (owner, data, onSuccess, onError) => {
        doFetch('api/tasks?owner=' + encodeURIComponent(owner), data, onSuccess, onError);
    },

    createComment : (data, onSuccess, onError) => {
        doFetch('api/comments', $.extend(data, {method: 'post', status: 201 }), onSuccess, onError);
    }    
};

