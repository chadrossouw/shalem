export class EventManager{

    constructor(el){
        this.el = el;
        this.events = [];
        window.addEventListener('popstate',this._onPopState.bind(this));
    }

    listen(event, callback){
        this.events.push({event:event, callback:callback});
        window.addEventListener(event,callback.bind(this.el));
    }

    emit(event, detail){
        this.el.dispatchEvent(
            new CustomEvent(event,
                {
                    detail: detail,
                    bubbles: true,
                    composed: true
                }
            )
        );
    }

    lazyEmit(event, detail){
        if(document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', () => {
                this.emit(event, detail);
            });
        }
        else {
            setTimeout(() => {
                this.emit(event, detail);
            }, 0);
        }
    }
    store(event, callback){
        this.events.push({event:event, callback:callback});
    }

    addHistory(url,state={}){
        window.history.pushState(state,'',url);
    }

    initHistory(state={}){
        window.history.replaceState(state,'',window.location.href);
    }

    disconnect(){
        this.events.forEach((event)=>{
            window.removeEventListener(event.event,event.callback.bind(this.el));
        });
        window.removeEventListener('popstate',this._onPopState.bind(this));
    }

    _onPopState(e){
        if(this.el.hasOwnProperty('_handleUpdate')){
            this.el._handleUpdate(e);
        }
    }
}