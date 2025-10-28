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
export {cardLinks}; 