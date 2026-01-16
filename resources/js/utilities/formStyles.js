import {css} from 'lit';

export const formStyles = css`
    input,textarea,select{
        width:100%;
        padding:0.75rem 1rem;   
        border-radius:var(--border-radius);
        border:2px solid var(--purple-shade-1);
    }

    textarea{
        min-height:8rem;
        font-family:var(--font-sans);
        padding: 0.5rem;
        resize:vertical;
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
    input[type="checkbox"], input[type="radio"]{
       position:absolute;
       opacity:0;
       &:checked{
            &+label::before{
                border-color:var(--green);
            }
            &+label::after{
                transform: translateY(-50%) scale(1);
            }
        }
    }
    input[type="checkbox"] + label, input[type="radio"] + label{
        cursor:pointer;
        position:relative;
        padding-left:2.5rem;
        &::before{
            content:'';
            position:absolute;
            top:50%;
            left:0;
            transform:translateY(-50%);
            width:1.5rem;
            height:1.5rem;
            border:2px solid var(--purple-shade-1);
            border-radius: 3px;
            background-color:var(--white);
        }
        &::after{
            content: '';
            position: absolute;
            top: 40%;
            left: 0.4rem;
            transform: translateY(-50%) scale(0);
            width: 1rem;
            height: 0.4rem;
            border:2px solid var(--green);
            border-top: none;
            border-right: none;
            background-color: transparent;
            rotate: -45deg;
            transition: transform var(--transition) ease-in-out;
        }
        &:hover{
            &::before{
                border-color:var(--purple-shade-1);
                background-color:var(--purple-shade-2);
            }
            &::after{
                transform: translateY(-50%) scale(1);
            }
        }
        
    }
    div:has(>input[type="checkbox"],>input[type="radio"]){
        position:relative;
    }
`;