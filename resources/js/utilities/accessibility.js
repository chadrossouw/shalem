import { css } from 'lit';
const cardLinks = (host) => {
    const cards = host.querySelectorAll('.card'); 
    if(cards.length){
        cards.forEach(card=>{
            
            let link = card.querySelector('.card_target');
            if(!link) return;
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e)=>{
                e.preventDefault();
                if(e.target.classList.contains('alt_trigger')||e.target.closest('.alt_block')) return;
                if(e.target.tagName == 'ALLIN-ALT_BLOCK' || e.target.closest('allin-alt-block')) return;
                if(e.target.tagName === 'A') return;
                link.click();
            });
        });
    } 
}
const accessibilityStyles = css`
    .screen-reader-text {
        border: 0;
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(50%);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute !important;
        width: 1px;
        word-wrap: normal !important; 
    }

    .screen-reader-text:focus {
            background-color: #fff;
            border-radius: 3px;
            box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
            clip: auto !important;
            clip-path: none;
            color: #000;
            display: block;
            font-size: 0.875rem;
            font-weight: 700;
            height: auto;
            left: 5px;
            line-height: normal;
            padding: 15px 23px 14px;
            text-decoration: none;
            top: 5px;
            width: auto;
            z-index: 100000;
        }
`;

export {cardLinks, accessibilityStyles}; 