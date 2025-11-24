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
        box-sizing: border-box;
    }
   
    /*Typography*/
    h1,.h1{
        font-size:var(--header);
        line-height:var(--header-line-height);
        font-weight: 800;
        margin-top:0;
    }

    h2,.h2{
        font-size:var(--subheader);
        line-height:var(--subheader-line-height);
        font-weight: 800;
        margin-top:0;
    }

    h3,.h3{
        font-size:var(--small-header);
        line-height:var(--small-header-line-height);
        margin-top:0;
    }

    h4,h5,h6,.h4{
         font-size:var(--big-body);
        line-height:var(--big-body-line-height);
        margin-top:0;
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
        &.cards{
            list-style: none;
            margin:0;
            padding:0;
            display:grid;
            gap:1rem;
        }
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
    p{
        margin-top:0;
        &.big{
            font-size:var(--big-body);
            line-height:var(--big-body-line-height);
        }
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
    .button,button{
        padding:0.75rem 1.5rem;
        border:none;
        border-radius:var(--border-radius);
        background-color:var(--purple);
        color:var(--white);
        font-size:var(--big-body);
        cursor:pointer;
        transition: background-color var(--transition) ease, color var(--transition) ease;
        &:hover, &:focus{
            background-color:var(--blue);
            color:var(--white);
        }
        &:has(>svg){
            display:flex;
            align-items:center;
            gap:1rem;
            svg{
                height:1.5rem;
                width:3rem;
            }  
        }
        &.back {
            svg{
                transition: transform var(--transition) ease;
                width:1.5rem;
                height:auto;
                path{
                    fill:var(--white);
                }
            }
            &:hover{
                svg{
                    transform:translateX(-0.25rem);
                }
            }
        }
    }
    .blue{
        color:var(--blue);
        &.shade_1{
            color:var(--blue-shade-1);
        }
        &.shade_2{
            color:var(--blue-shade-2);
        }
    }
    .light_blue{
        color:var(--light-blue);
        &.shade_1{
            color:var(--light-blue-shade-1);
        }
        &.shade_2{
            color:var(--light-blue-shade-2);
        }
    }
    .yellow{
        color:var(--yellow);
        &.shade_1{
            color:var(--yellow-shade-1);
        }
        &.shade_2{
            color:var(--yellow-shade-2);
        }
    }
    .green{
        color:var(--green);
        &.shade_1{
            color:var(--green-shade-1);
        }
        &.shade_2{
            color:var(--green-shade-2);
        }
    }
    .purple{
        color:var(--purple);
        &.shade_1{
            color:var(--purple-shade-1);
        }
        &.shade_2{
            color:var(--purple-shade-2);
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
            background-color:var(--blue-shade-1);
        }
        &.bg_shade_2{
            background-color:var(--blue-shade-2);
        }
    }
    .bg_light_blue{
        background-color:var(--light-blue);
        &.bg_shade_1{
            background-color:var(--light-blue-shade-1);
        }
        &.bg_shade_2{
            background-color:var(--light-blue-shade-2);
        }
    }
    .bg_yellow{
        background-color:var(--yellow);
        &.bg_shade_1{
            background-color:var(--yellow-shade-1);
        }
        &.bg_shade_2{
            background-color:var(--yellow-shade-2);
        }
    }
    .bg_green{
        background-color:var(--green);
        &.bg_shade_1{   
            background-color:var(--green-shade-1);
        }
        &.bg_shade_2{
            background-color:var(--green-shade-2);
        }
    }
    .bg_purple{
        background-color:var(--purple);
        &.bg_shade_1{
            background-color:var(--purple-shade-1);
        }
        &.bg_shade_2{
            background-color:var(--purple-shade-2);
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
    .header_with_icon{
        display:grid;
        grid-template-columns:6rem 1fr;
        gap:1rem;
        margin-bottom:2rem;
        margin-top:2rem;
        h1:not(.h3){
            width:min-content;
        }
        h1,h2{
            margin:0;
        }
        svg{
            width:6rem;
            height:auto;
        }
    }
    @media (min-width:700px){
        .header_with_icon{
            grid-template-columns:8rem 1fr;
            gap:2rem;
            svg{
                width:8rem;
            }
        }
    }
    @media (min-width:1200px){
        .header_with_icon{
            grid-template-columns:10rem 1fr;
            svg{
                width:9rem;
            }
        }
    }
    .header{
        margin-bottom:2rem;
        margin-top:2rem;
    }
    .shadow{
        box-shadow: var(--box-shadow);
    }
    .button-group,.button_group{
        display:flex;
        gap:1rem;
        flex-wrap:wrap;
        justify-content:flex-start;
        margin-top:2rem;
    }
    
`;

export const cards = css`
    .card:has(>.icon){
        display:grid;
        grid-template-rows:auto 250px auto;
        gap:1rem;
        button{
            width:100%;
            font-size:var(--big-body);
            font-weight:700;
            text-align:center;
            box-sizing:border-box;
        }
        .icon{
            width:250px;
            height:250px;
            padding:1rem;
            position:relative;
            align-self:center;
            justify-self:center;
            &::before{
                content:'';
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background-color:var(--white);
                border-radius:var(--border-radius-big);
                transition: transform calc(var(--transition) * 6) linear;
                clip-path: shape(from 81.98% 16.2%,curve to 99.73% 52.66% with 93.4% 26.45%/101.61% 40.42%,curve to 74.6% 84.2% with 97.92% 64.84%/86.02% 75.29%,curve to 41.88% 99.97% with 63.18% 93.12%/52.25% 100.51%,curve to 14.59% 82.01% with 31.58% 99.37%/21.76% 90.92%,curve to 0.81% 52.66% with 7.35% 73.09%/2.62% 63.71%,curve to 7.21% 18.53% with -1.07% 41.55%/0.04% 28.71%,curve to 41.95% 0.03% with 14.45% 8.28%/27.89% 0.63%,curve to 81.98% 16.2% with 55.94% -0.5%/70.56% 5.95%,close);
                z-index:0;
            }
            svg{
                position:relative;
                z-indec:1;
                height:calc(250px - 2rem);
                width:calc(250px - 2rem);
            }
        }
        &:hover .icon::before{
            transform: scale(0.6) rotate(360deg);
        }

    }

    .card:has(>.icon):nth-child(2n){
        .icon::before{
            clip-path: shape(from 75.87% 26.96%,curve to 99.59% 60.56% with 85.61% 38.21%/97.36% 47.94%,curve to 84.71% 95.23% with 101.83% 73.1%/94.51% 88.46%,curve to 52.08% 98.19% with 74.96% 101.99%/62.74% 100.17%,curve to 22.31% 87.4% with 41.37% 96.21%/32.29% 94.16%,curve to 0.16% 56% with 12.38% 80.63%/1.55% 69.23%,curve to 16.74% 16.63% with -1.23% 42.77%/6.81% 27.88%,curve to 48.45% 0.51% with 26.73% 5.45%/38.59% -2.07%,curve to 75.87% 26.96% with 58.32% 3.09%/66.07% 15.79%,close);
        }
    }

    .card:has(>.icon):nth-child(3n){
        .icon::before{
            clip-path: shape(from 81.98% 16.2%,curve to 99.73% 52.66% with 93.4% 26.45%/101.61% 40.42%,curve to 74.6% 84.2% with 97.92% 64.84%/86.02% 75.29%,curve to 41.88% 99.97% with 63.18% 93.12%/52.25% 100.51%,curve to 14.59% 82.01% with 31.58% 99.37%/21.76% 90.92%,curve to 0.81% 52.66% with 7.35% 73.09%/2.62% 63.71%,curve to 7.21% 18.53% with -1.07% 41.55%/0.04% 28.71%,curve to 41.95% 0.03% with 14.45% 8.28%/27.89% 0.63%,curve to 81.98% 16.2% with 55.94% -0.5%/70.56% 5.95%,close);
        }
    }
    
    @media (min-width:1000px){
        .card:has(>.icon){
            grid-template-rows:1fr auto;
            grid-template-columns:1fr 1fr;
            .icon{
                grid-row:1/2;
                grid-column:1 / 2;
            }
            button{
                grid-column:1/-1;
            }
        }
    }
`