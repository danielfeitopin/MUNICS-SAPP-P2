const config = {
    formValidator : {
       validateOnBlur: false,
       onElementValidate: function (valid, $el) {
           if (valid) {
               $($el.data('validation-error-msg-container')).closest('.form-group').addClass('d-none');
           } else {
               $($el.data('validation-error-msg-container')).closest('.form-group').removeClass('d-none');
           }
       }
    } 
};
 