
(function(){
    var settings = {}
    var app = {
        init: function(){
            position.set();
        },
    }

    var position = {
        set: function(){
            helper.isNumber('1');
            this.check();
        },
        check: function(){
            var self = this;
            var el = document.body
            this.set()
            
            el.addEventListener('touchstart', function(){
                // this.update().bind(this) < Dit is complexer
                self.update()
            })
            
            // es6 manier
            el.addEventListener('touchstart', ()=>{
                // This verwijst nu wel naar de scope van position, danku es6
                this.update()
            })

        },
        update: function(){}
    }

    var helper = {
        isNumber: function(){},
        getElement: function(){
            return Document.querySelector()
        }
    }

    var $ = helper.getElement()

    // Start de app
    app.init()

}())