import { css } from "lit";

export const badgeStyles = css`       
    .badge_card{
        text-align: center;
        padding: 1rem;
        display:grid;
        grid-template-rows: auto 100px auto;
        position:relative;
        --badge_color: currentColor;
        & h3{
            margin:0;
            font-size:1.5rem;
            top:0;
            left:0;
            width:100%;
            position:relative;
            z-index:10;
            &:last-of-type{
                top:unset;
                bottom:0;
            }
        }
    }
    .badge_avatar{
        width:100px;
        height:100px;
        background-color:currentColor;
        border-radius:50%;
        position:relative;
        z-index:5;
        filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.5));
        svg{
            position:absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            width:110px;
        }
    }
    .style_1{
        h3{
            line-height:50%;
        }
        .badge_avatar{
            background-color:color-mix(in srgb,var(--badge_color), white 50%);
        }
    }
    .style_2{
        h3{
            line-height:95%;
            &:first-of-type{
                transform: rotate(-30deg);
                transform-origin: center calc(1.5rem + 50px);
            }
        }
    }
    .style_3{
        h3{
            filter: brightness(0.75) saturate(1.5);
        }
    }
    .style_4{
        .badge_avatar{
            border-radius:0;
            background-color:transparent;
            &::before{
                content:'';
                background-color:var(--badge_color);
                clip-path: shape(from 46.94% 1.49%,curve to 53.28% 1.5% with 48.48% -0.5%/51.74% -0.5%,line to 67.73% 20.32%,curve to 70.64% 21.81% with 68.4% 21.19%/69.47% 21.73%,line to 96.4% 23.42%,curve to 99.58% 28.48% with 99.16% 23.59%/100.83% 26.25%,line to 88.34% 48.5%,curve to 88.33% 51.64% with 87.79% 49.48%/87.78% 50.65%,line to 99.48% 71.7%,curve to 96.28% 76.74% with 100.72% 73.93%/99.04% 76.58%,line to 70.52% 78.27%,curve to 67.6% 79.75% with 69.35% 78.33%/68.28% 78.88%,line to 53.06% 98.51%,curve to 46.72% 98.5% with 51.52% 100.5%/48.26% 100.5%,line to 32.27% 79.68%,curve to 29.36% 78.19% with 31.6% 78.81%/30.53% 78.27%,line to 3.6% 76.58%,curve to 0.42% 71.52% with 0.84% 76.41%/-0.83% 73.75%,line to 11.66% 51.5%,curve to 11.67% 48.36% with 12.21% 50.52%/12.22% 49.35%,line to 0.52% 28.3%,curve to 3.72% 23.26% with -0.72% 26.07%/0.96% 23.42%,line to 29.48% 21.73%,curve to 32.4% 20.25% with 30.65% 21.67%/31.72% 21.12%,line to 46.94% 1.49%,close);
                width:120px;
                height:120px;
                position:absolute;
                top:-10px;
                left:-10px;
            }
        }
        h3{
            line-height:130%;
        }
    }
`;