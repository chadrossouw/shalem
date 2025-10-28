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
        if(e.state){
            let state = Object.entries(e.state);
            if(state.length==0){
                return;
            }
            state.forEach((item)=>{
                let _key = item[0];
                let _value = item[1];
                this.el.setAttribute(_key,_value);
            });
        }
    }
}