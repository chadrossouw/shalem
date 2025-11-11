export const ShalemBaseForm = (superClass) => class extends superClass{
    _handleSubmit(e){
        e?.preventDefault();
    }

    _validateForm(){
        return true;
    }

    async _submitForm(data){
        return true;
    }

    _handleSuccess(response){
        console.log('Form submitted successfully:', response);
    }

    _handleError(error){
        console.error('Form submission error:', error);
    }
};