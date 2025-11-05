const cardLinks = (host) => {
    const cards = host.querySelectorAll('.card'); 
    if(cards.length){
        cards.forEach(card=>{
            
            let link = card.querySelector('.card_target');
            if(!link) return;
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e)=>{
                e.preventDefault();
                if(e.target.tagName === 'A') return;
                link.click();
            });
        });
    } 
}
export {cardLinks}; 