import {css} from 'lit';

export const formStyles = css`
    input,textarea,select{
        width:100%;
        padding:0.75rem 1rem;   
        border-radius:var(--border-radius);
        border:2px solid var(--purple-shade-1);
    }

    input:focus,textarea:focus,select:focus{
        outline:2px solid var(--purple-shade-2)
    }

    input::placeholder,textarea::placeholder{
        color:var(--purple-shade-2);
    }
    button[type="submit"]{
        background-color:var(--green);
        color:var(--black);
        margin-top:2rem;
    }
    label{
        padding-left:0.25rem;
        margin-bottom:1rem;
        display:block;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .input_group{
        margin-bottom:1.5rem;
    }
`;