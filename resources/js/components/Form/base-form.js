import { safeFetch } from "../../common/xsrf.js";
export const BaseForm = (superClass) => class extends superClass{
    get _form(){
        return this.shadowRoot.querySelector('form');
    }

    get _type(){
        return this._form?.enctype;
    }

    get _formResponse(){
        return this._form?.querySelector('.form-response');
    }

    get _submitButton(){
        return this._form?.querySelector('button[type="submit"], input[type="submit"]');
    }

    get _formActionUrl(){
        return this._form?.action || '';
    }

    firstUpdated(){
        if(!this._formResponse){
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('form-response');
            this._form.append(responseDiv);
        }
    }

    _handleSubmit(e){
        e?.preventDefault();
        if(this._validateForm()){
            this._submitForm();
        }
    }

    _validateForm(){
        this._formResponse.setAttribute('aria-live','polite');
        this._clearResponse();

        let errors = [];
        let dependentFields = this._form.querySelectorAll('[data-requiredif]');
        dependentFields.forEach(field=>{
            field.removeAttribute('aria-required');
            let dependency = field.dataset.requiredif;
            if(dependency){
                dependency = this._form.querySelector(`#${dependency}`);
                if(dependency){
                    let potentialValue = field.dataset.requiredifvalue;
                    if(potentialValue){
                        if(dependency.value==potentialValue){
                            field.setAttribute('aria-required','true');
                        }
                    }
                    else{
                        if(dependency.value){
                            field.setAttribute('aria-required','true');
                        }
                    }
                }
            }
        });    
        
        let requiredFields = this._form.querySelectorAll('[aria-required="true"]');
        requiredFields.forEach(field=>{ 
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
            field.classList.remove('error');
            let error = field.parentNode.querySelector(`#${field.id}_error`);
            if(error){
                error.remove();
            }
            let isValid = true;
            let isCheckbox = field.type=='checkbox';
            let isSelect = field.tagName.toLowerCase()=='select';
            if(isCheckbox&&!field.checked){
                isValid = false;
            }
            else if(isSelect&&(field.value==''||field.value=='Select')){
                isValid = false;
            }
            else if(field.type=='file'){ 
                if(field.files.length==0){
                    isValid = false;
                }
                if(field.files.length>0){
                    if(field.files[0].size==0){
                        isValid = false;
                    }
                }
                if(field.parentNode.querySelector('[type=hidden]')){
                    let hiddenField = field.parentNode.querySelector('[type=hidden]');
                    if(hiddenField.value==''){
                        isValid = false;
                    }
                    else{
                        isValid = true;
                    }
                }
                

            }
            else if(field.hasAttribute('aria-multiselectable')){
            return; //skip validation for multiselectable fields
            }
            else if(!field.value){
                isValid = false;
            }
            if(!isValid){
                field.setAttribute('aria-invalid','true');
                field.setAttribute('aria-describedby',field.id + '_error');
                field.classList.add('error');
                let span = document.createElement('span');
                span.id=field.id + '_error';
                span.classList.add('error_message');
                let message = field.dataset.error_message;
                if(!message){
                    let label ='';
                    if(field.labels?.length>0){
                        label = field.labels[0]?.innerText;
                        if(label){
                            if(label[label.length-1]=='*'||label[label.length-1]=='.'){
                                label = label.slice(0,-1);
                            }
                        }
                    }
                    if(field.dataset?.label){
                        label = field.dataset.label;
                    }
                    if(field.getAttribute('aria-labelledby')){
                        let labelId = field.getAttribute('aria-labelledby');
                        let labelElement = document.getElementById(labelId);
                        if(labelElement){
                            label = labelElement.innerText;
                            if(label[label.length-1]=='*'||label[label.length-1]=='.'){
                                label = label.slice(0,-1);
                            }
                        }
                    }
                    message = `${label} is required`;
                }
                span.innerHTML = message;
                errors.push(message);
                if(!isCheckbox){
                    field.insertAdjacentElement('afterend',span);
                }
                else{
                    field.parentNode.appendChild(span);
                }
            }
        });
        
        
            
        const emailFields = this._form.querySelectorAll('[type=email]');
        //validate email
        if(emailFields.length>0){
            emailFields.forEach(emailField=>{
                if(emailField?.value){
                    emailField.removeAttribute('aria-invalid');
                    emailField.removeAttribute('aria-describedby');
                    emailField.classList.remove('error');
                    let error = emailField.parentNode.querySelector(`#${emailField.id}_error`);
                    if(error){
                        error.remove();
                    }
                
                    const test = /\S+@\S+\.\S+/;
                    const emailValid = test.test(emailField.value);
                    if(!emailValid){
                        emailField.setAttribute('aria-invalid','true');
                        emailField.setAttribute('aria-describedby',emailField.id + '_error');
                        emailField.classList.add('error');
                        let span = document.createElement('span');
                        span.id=emailField.id + '_error';
                        span.classList.add('error_message');
                        let message = msg(str`Please enter a valid email address`,{desc: "Error message for invalid email address"});
                        span.innerHTML = message;
                        errors.push(message);
                        emailField.insertAdjacentElement('afterend',span);
                    }
                }
            });
        }
        const urlFields = this._form.querySelectorAll('[type=url]');
        //validate url
        if(urlFields.length>0){
            urlFields.forEach(urlField=>{
                if(!urlField.value) return;
                urlField.removeAttribute('aria-invalid');
                urlField.removeAttribute('aria-describedby');
                urlField.classList.remove('error');
                let error = urlField.parentNode.querySelector(`#${urlField.id}_error`);
                if(error){
                    error.remove();
                }
                if(urlField?.value){
                    try{
                        const currentUrl = new URL(urlField.value);
                        const { protocol } = currentUrl;

                        if (protocol !== 'http:' && protocol !== 'https:') {
                            currentUrl.protocol = 'https:';
                            urlField.value = currentUrl.toString();
                        }
                    }
                    catch(error){
                        urlField.value = `https://${urlField.value}`;
                    }
                }
            });
        }
        if(errors.length>0){
            let pError = document.createElement('p');
            pError.innerHTML = msg(str`Failed to submit because ${errors.length} ${errors.length>1?'fields are':'field is'} invalid. Please correct the errors below:<ul><li>${errors.join('</li><li>')}</li></ul>`,{desc: "Error messages for invalid form submission"});
            this._formResponse.appendChild(pError);
            this._formResponse.classList.add('error');
            return false;
        }
        else{
            return true;
        }
    }

    async _submitForm(){
        this._setLoading(true);
        const formData = new FormData(this._form);
        // Convert FormData to JSON
        const options = {};
        if(this._form.enctype === 'multipart/form-data'){
            options.body = formData;
            options.method = 'POST';
            options.headers = {
                'Accept': 'application/json',
            };
        }
        else{
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            options.body = JSON.stringify(data);
            options.method = 'POST';
        }

        try {
            const response = await safeFetch(this._formActionUrl, options, this._form.enctype === 'multipart/form-data' );
            if (!response.ok) {
                throw new Error('Something went wrong.');
            }
            const responseData = await response.json();
            this._handleSuccess(responseData);
        } catch (error) {
            this._handleError(error);
        } finally {
            this._setLoading(false);
        }
    }

    _clearResponse(){
        this._formResponse.innerHTML = '';
        this._formResponse.classList.remove('error');
        this._formResponse.classList.remove('success');
    }

    _setLoading(isLoading){
        if(isLoading){
            this._form.classList.add('loading');
            this._submitButton.disabled = true;
        }
        else{
            this._form.classList.remove('loading');
            this._submitButton.disabled = false;
        }
    }

    _handleSuccess(response){
        if( !response ) return;
        if( response.redirectUrl ){
            window.location.href = response.redirectUrl;
            return;
        }
        if(response.action){
            this._handleAction(response.action);
            return;
        }
        if( response.view){
            this._updateContext({view: response.view});
            return;
        }
        if( response.message ){
            this._formResponse.innerHTML = `<p class="success-message">${response.message}</p>`;
            this._formResponse.classList.add('success');
        }
    }

    _handleError(error){
        this._formResponse.innerHTML = `<p class="error-message">An error occurred while submitting the form. Please try again.</p>`;
        this._formResponse.classList.add('error');
        console.error('Form submission error:', error);
    }
};