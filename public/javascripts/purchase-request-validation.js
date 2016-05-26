$(document).ready(function () {
    $('#purchaseRequestForm').formValidation({
        framework: 'semantic',
        fields: {
            'content[publication_title]': {
              trigger: 'blur',
                validators: {
                    notEmpty: {
                        message: 'Publication Title is required'
                    }
                }
            },
            'content[isbn]': {
                trigger: 'blur',
                validators: {
                    isbn: {
                        message: 'The value is not valid ISBN'
                    }
                }
            },
            'content[issn]': {
                trigger: 'blur',
                validators: {
                    issn: {
                        message: 'The value is not valid ISSN'
                    }
                }
            },
            'content[price]': {
                validators: {
                    numeric: {
                        message: 'Price must be a number'
                    }
                }
            },
            'content[full_name]': {
                trigger: 'blur',
                validators: {
                    notEmpty: {
                        message: 'Full Name is required'
                    }
                }
            },
            'content[phone_number]': {
                trigger: 'blur',
                validators: {
                    notEmpty: {
                        message: 'Phone number is required'
                    },
                    phone: {
                        country: 'US',
                        message: 'The value is not valid phone number'
                    }
                }
            },
            'content[email_address]': {
                trigger: 'blur',
                validators: {
                    notEmpty: {
                        message: 'Email Address number is required'
                    },
                    regexp: {
                        regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                        message: 'The value is not a valid email address'
                    }
                }
            }
        }
    })
    .on('success.field.fv', function(e, data) {
         // If the field is empty
         if (data.element.val() === '') {
             var $parent = data.element.parents('.form-group');

             // Remove the has-success class
             $parent.removeClass('has-success');

             // Hide the success icon
            //  data.element.data('fv.icon').hide();
         }
     });
});
