import {css} from 'lit';

export const baseStyles = css`
    :host {
        box-sizing: border-box;
        font-size:var(--body);
        line-height:var(--body-line-height);
    }
    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }
   
    /*Typography*/
    h1,.h1{
        font-size:var(--header);
        line-height:var(--header-line-height);
    }

    h2,.h2{
        font-size:var(--subheader);
        line-height:var(--subheader-line-height);
    }

    h3,.h3{
        font-size:var(--small-header);
        line-height:var(--small-header-line-height);
    }

    h4,h5,h6,.h4{
         font-size:var(--big-body);
        line-height:var(--big-body-line-height);
    }

    table {
        margin: 0 0 1.5em;
        width: 100%;
    }

    /* Make sure embeds and iframes fit their containers. */
    embed,
    iframe,
    object {
        max-width: 100%;
    }

    img {
        height: auto; 
        max-width: 100%; 
    }

    figure {
        margin: 1em 0; 
    }

    /*Lists*/
    ul,
    ol {
        margin: 0 0 1.5em 0;
    }

    ul {
        list-style: disc;
    }

    ol {
        list-style: decimal;
    }

    li > ul,
    li > ol {
        margin-bottom: 0;
        margin-left: 1.5em;
    }

    dt {
        font-weight: 700;
    }

    dd {
        margin: 0 1.5em 1.5em;
    }

    address {
        font-style: normal;
    }
    /*Links*/
    a {
        color: var(--purple);
        text-decoration-thickness: 0.05em;
        transition: text-decoration-thickness var(--transition) ease,
            color var(--transition) ease;
        &:visited {
            color: var(--purple);
        }

        &:hover,
        &:focus,
        &:active {
            color: var(--blue);
            text-decoration-thickness: 0.1em;
        }

        &:hover,
        &:active {
            outline: 0;
        }

        &:focus {
            outline: 2px solid;
        }
    }

    .margins{
        margin: 0 var(--margins);
    }
    .padding{
        padding: 2rem var(--paddings); 
    }
    .inner_padding{
        padding: var(--inner-padding);
    }
    .inner_padding_big{
        padding: var(--inner-padding-big);
    }
    .grid{
        display:grid;
        gap:1rem;
        &.grid_50{
            grid-template-columns:repeat(2,1fr);
        }
        &.grid_33{
            grid-template-columns:repeat(3,1fr);
        }
    }
    .flex{
        display:flex;
        justify-content:space-between;
    }
    .blue{
        color:var(--blue);
        &.shade_1{
            color:var(--blue-shade_1);
        }
        &.shade_2{
            color:var(--blue-shade_2);
        }
    }
    .light_blue{
        color:var(--light-blue);
        &.shade_1{
            color:var(--light-blue-shade_1);
        }
        &.shade_2{
            color:var(--light-blue-shade_2);
        }
    }
    .yellow{
        color:var(--yellow);
        &.shade_1{
            color:var(--yellow-shade_1);
        }
        &.shade_2{
            color:var(--yellow-shade_2);
        }
    }
    .green{
        color:var(--green);
        &.shade_1{
            color:var(--green-shade_1);
        }
        &.shade_2{
            color:var(--green-shade_2);
        }
    }
    .purple{
        color:var(--purple);
        &.shade_1{
            color:var(--purple-shade_1);
        }
        &.shade_2{
            color:var(--purple-shade_2);
        }
    }
    .aqua{
        color:var(--aqua);
    }
    .black{
        color:var(--black);
    }
    .white{
        color:var(--white);
    }
    .bg_blue{
        background-color:var(--blue);
        &.bg_shade_1{
            background-color:var(--blue-shade_1);
        }
        &.bg_shade_2{
            background-color:var(--blue-shade_2);
        }
    }
    .bg_yellow{
        background-color:var(--yellow);
        &.bg_shade_1{
            background-color:var(--yellow-shade_1);
        }
        &.bg_shade_2{
            background-color:var(--yellow-shade_2);
        }
    }
    .bg_green{
        background-color:var(--green);
        &.bg_shade_1{   
            background-color:var(--green-shade_1);
        }
        &.bg_shade_2{
            background-color:var(--green-shade_2);
        }
    }
    .bg_purple{
        background-color:var(--purple);
        &.bg_shade_1{
            background-color:var(--purple-shade_1);
        }
        &.bg_shade_2{
            background-color:var(--purple-shade_2);
        }
    }
    .bg_aqua{
        background-color:var(--aqua);
    }
    .bg_black{
        background-color:var(--black);
    }
    .bg_white{
        background-color:var(--white);
    } 
    .radius{
        border-radius:var(--border-radius);
    }
    .radius-big{
        border-radius:var(--border-radius-big);
    }
`;

