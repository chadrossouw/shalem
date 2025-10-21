const blink = (eye) => {
    if(!eye.classList.contains('blinking')){
        eye.style.animationDuration = `calc(${Math.random()} * var(--blinktransition) + 2000ms)`;
        eye.style.animationDelay = `calc(${Math.random()} * var(--blinkdelay))`;
        eye.classList.add('blinking');
    }
};

const throb = (eye) => {
    if(!eye.classList.contains('throbbing')){
        eye.style.animationDuration = `calc(${Math.random()} * var(--throbtransition) + 2000ms)`;
        eye.classList.add('throbbing');
    }
};

const blinkAllEyes = () => {
    document.querySelectorAll('.eyes').forEach(eye => {
        blink(eye);
    }
    );
};

const throbAllEyes = () => {
    document.querySelectorAll('.throb').forEach(eye => {
        throb(eye);
    });
};

export { blink, throb,blinkAllEyes, throbAllEyes };