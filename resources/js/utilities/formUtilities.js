import { safeFetch } from '../common/xsrf.js';
import {eyeSvg,eyeClosedSvg} from '../icons/icons.js';

const validateForm = (form, formResponse) => {
    //add get element method so we can either use a node or an array of elements
    form.getElement = function(selector,all,type){
        if(this instanceof HTMLElement){
            if(type=='id'){
                selector = `#${selector}`;
            }
            else if(type=='class'){
                selector = `.${selector}`;
            }
            else if(type=='attribute'){
                selector = `[${selector}]`;
            }
            else if(type=='tag'){
                selector = `${selector}`;
            }
            if(all){
                return this.querySelectorAll(selector);
            }
            return this.querySelector(selector);
        }
        else{
            const results = this.filter(el=>{
                if(type=='id'){
                    return el.id == selector;
                }
                else if(type=='class'){
                    return el.classList.contains(selector);
                }
                else if(type=='attribute'){
                    let attr = selector.split('=');
                    if(attr.length>1){
                        return el.getAttribute(attr[0])==attr[1];
                    }
                    return el.getAttribute(selector);
                }
                else if(type=='tag'){
                    return el.tagName.toLowerCase()==selector;
                }
            })

            if(all){
                return results;
            }
            if(results.length>0){
                return results[0];
            }
            return null;
        }
    }
    formResponse.setAttribute('aria-live','polite');
    formResponse.innerHTML = '';

    let errors = [];
    let honeypot = form.getElement('hp',false,'class');
    if(honeypot?.value){
        return false;
    }
    let dependentFields = form.getElement('data-requiredif',true,'attribute');
    dependentFields.forEach(field=>{
        field.removeAttribute('aria-required');
        let dependency = field.dataset.requiredif;
        if(dependency){
            dependency = form.getElement(dependency,false,'id');
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
    
    let requiredFields = form.getElement('aria-required',true,'attribute');
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
                message = msg(str`${label} is required`,{desc: "Error message for required field"});
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
    
        
    let textareas = form.getElement('textarea',true,'tag');
    textareas.forEach(textarea=>{
        let customElement = textarea.closest('allin-textarea-counter');
        if(customElement){
            let validity = customElement.reportValidity();
            if(!validity){
                errors.push(customElement.validationMessage);
            }
        }
    });
        
    const emailFields = form.getElement('type=email',true,'attribute');
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
    const urlFields = form.getElement('type=url',true,'attribute');
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

    let multiSelects = form.getElement('type=hidden',true,'attribute');
    if(multiSelects.length>0){
        multiSelects = Array.from(multiSelects);
        let ms = multiSelects.filter(el=>{
            return el.dataset.type=='multiselect'
        });
        ms.forEach(multiSelectInput=>{
            let multiSelect = multiSelectInput.closest('allin-multiselect');
            if(!multiSelect) return;
            multiSelect.removeAttribute('isinvalid');
            if(multiSelect.attributes?.required){
                let value = multiSelectInput.value;
                if(!value){
                    multiSelect.setAttribute('isinvalid',true);
                    let msg = multiSelect.getAttribute('errormessage');
                    if(!msg){
                        let label = multiSelect.querySelector('.listbox-label');
                        label = labelElement.innerText;
                        if(label[label.length-1]=='*'||label[label.length-1]=='.'){
                            label = label.slice(0,-1);
                        }
                        msg = msg(str`${label} is required`,{desc: "Error message for required multiselect field"});
                    }
                    errors.push(msg);
                }
            }
        })
    }

    if(errors.length>0){
        let pError = document.createElement('p');
        pError.innerHTML = msg(str`Failed to submit because ${errors.length} ${errors.length>1?'fields are':'field is'} invalid. Please correct the errors below:<ul><li>${errors.join('</li><li>')}</li></ul>`,{desc: "Error messages for invalid form submission"});
        formResponse.appendChild(pError);
        formResponse.classList.add('error');
        return false;
    }
    else{
        return true;
    }
}

const validationHandler = (field,message) => {
    field.setAttribute('aria-invalid','true');
    field.setAttribute('aria-describedby',field.id + '_error');
    field.classList.add('error');
    let span = document.createElement('span');
    span.id=field.id + '_error';
    span.classList.add('error_message');
    span.innerHTML = message;
    field.insertAdjacentElement('afterend',span);
}

const validationHandlerClear = (field) => {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    field.classList.remove('error');
    let error = field.parentNode.querySelector(`#${field.id}_error`);
    if(error){
        error.remove();
    }
}

const validateGToken = async (token, formResponse, action) => {
    let validation = false;
    try{
        if(!token){
            return false;
        }
        let response = await safeFetch(action, {
            body: JSON.stringify({token: token}),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        response = await response.json();
        console.log(response);
        if(response.success){
            validation = true;
        }
        else{
            formResponse.innerHTML = response.message;
        }
    }
    catch(error){
        formResponse.innerHTML = 'Something went wrong. Please try again.';
    };
    return validation; 
}

const gRecaptcha = async (formResponse,action) => {
    let grecaptcha  = window.grecaptcha; 
    let gTokenValid = false;
    try{
        const token = await grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {action: 'LOGIN'});
        gTokenValid = validateGToken(token,formResponse,action);
    }
    catch(error){
        formResponse.innerHTML = 'Something went wrong. Please try again.';
    }
    return gTokenValid;
}

const validatePassword = (password) => {
    let errors = [];
    let isValid = true;
    if(password.length<8){
        isValid = false;
        errors.push(msg(str`Password must be at least 8 characters`));
    }
    if(!password.match(/[A-Z]/)){
        isValid = false;
        errors.push(msg(str`Password must contain at least one uppercase letter`));
    }
    if(!password.match(/[a-z]/)){
        isValid = false;
        errors.push(msg(str`Password must contain at least one lowercase letter`));
    }
    if(!password.match(/[0-9]/)){
        isValid = false;
        errors.push(msg(str`Password must contain at least one number`));
    }
    if(!password.match(/[^a-zA-Z0-9]/)){
        isValid = false;
        errors.push(msg(str`Password must contain at least one special character`));
    }
    if(!isValid){
        return errors;
    }
    else{
        return true;
    }
}

const validateEmail = (email) => {
    const test = /\S+@\S+\.\S+/;
    return test.test(email);
}

const hideRevealPassword = (e)=>{
    e.preventDefault();
    let passwordField = e.currentTarget.parentNode.querySelector(`#${e.currentTarget.dataset.switch}`);
    if(passwordField.type === 'password'){
        passwordField.type = 'text';
    }
    else{
        passwordField.type = 'password';
    }
    let showStr = `<span class="screen-reader-text">Hide password</span>${eyeSvg.strings[0]}`;
    let hideStr = `<span class="screen-reader-text">Show password</span>${eyeClosedSvg.strings[0]}`;
    e.currentTarget.setAttribute('aria-pressed',e.currentTarget.getAttribute('aria-pressed')==='true'?'false':'true');
    e.currentTarget.setAttribute('aria-label',e.currentTarget.getAttribute('aria-pressed')==='true'?'Hide password':'Show password');
    e.currentTarget.innerHTML = e.currentTarget.getAttribute('aria-pressed')==='true'?hideStr:showStr;
}


const hideRevealInputs = (el) => {
    let hiders = [];
    if(Array.isArray(el)){
        hiders = el.map(item => Array.from(item.querySelectorAll('[data-hider]'))).flat().filter((item)=> item.length);
        el =  el[0].closest('form');
    }
    else{
        hiders = el.querySelectorAll('[data-hider]');
    }

    if(hiders.length>0){
        hiders.forEach(hider=>{
            hideRevealInput(hider, el);
            hider.addEventListener('change',hideRevealInputOnChange)
        });
    }

}
const hideRevealInput=(hider, form, dispatch = false)=>{
    let target = hider.dataset.hider;
    let targetEl = form.querySelector(`.${target}`);
    let revealKey = hider.dataset.reveal;
    if(hider.value===revealKey){
        if(targetEl){
            targetEl.classList.remove('hidden');
        }
    }
    else{
        if(targetEl){
            targetEl.classList.add('hidden');
            targetEl.querySelectorAll('input,select,textarea').forEach(input=>{
                input.value = '';
                if(dispatch){
                    input.dispatchEvent(new Event('input'));
                }
            });
        }
    }
}

const hideRevealInputOnChange=(e)=>{
    let hider = e.currentTarget;
    let form = hider.closest('form');
    hideRevealInput(hider, form, true);
}

const removeHideRevealInputs = (el) => {
    if(!el) return;
    let hiders = el.querySelectorAll('[data-hider]');
    if(hiders.length>0){
        hiders.forEach(hider=>{
            hider.removeEventListener('change',hideRevealInputOnChange);
        });
    }
}

const validateURL = (urlField) =>{
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
}

const validatePhone = (phoneField) => {

}

export { 
    validateForm, 
    validatePassword, 
    validateEmail, 
    validateGToken, 
    gRecaptcha, 
    validationHandler, 
    validationHandlerClear, 
    hideRevealPassword, 
    hideRevealInputs,
    removeHideRevealInputs,
    validateURL,
    validatePhone
};