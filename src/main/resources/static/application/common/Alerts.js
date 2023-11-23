const alerts = {
    success : (message) => {
        new Noty({
            text: message,
            type: 'success',
            layout: 'topRight',
            theme: 'bootstrap-v4',
            timeout: 5000
        }).show();
    },

    error : (message) => {
        new Noty({
            text: message,
            type: 'error',
            layout: 'topRight',
            theme: 'bootstrap-v4',
            timeout: 5000
        }).show();
    }
};