var controller = function(){

    var public = {
        regEvents: function(){
            ae('#aside').add({
                'id':'aside-show',
                'final':true,
                0:{
                    'margin-left':'-280px'
                },
                500:{
                    'margin-left':'0px',
                    'curve':'cubic-bezier(0,0,.22,1)'
                }
            });
            ae('#aside').add({
                'id':'aside-hide',
                'final':true,
                0:{
                    'margin-left':'0px'
                },
                300:{
                    'margin-left':'-280px',
                    'curve':'cubic-bezier(.63,0,1,1)'
                }
            });
            ae('#float-button').add({
                'id':'fb-hide',
                'final':true,
                0:{
                    transform:'rotate(0deg)',
                    opacity: '1'
                },
                500:{
                    transform:'rotate(90deg)',
                    opacity: '0'
                }
            });
            ae('#float-button').add({
                'id':'fb-show',
                'final':true,
                0:{
                    height:'0px',
                    width:'0px',
                    'border-radius':'0px',
                    right:'44px',
                    bottom:'84px'
                },
                500:{
                    height:'56px',
                    width:'56px',
                    'border-radius':'28px',
                    right:'16px',
                    bottom:'56px'
                }
            });


            $('#menu').on('tap',function(){
                ae('#aside').clear().play('aside-show');
                view.addMask();
                setTimeout(function(){
                    $('#mask').one('tap',function(e){
                        ae('#aside').clear().play('aside-hide');
                        $('#mask').remove();
                    })
                },0)
            });

            $('#aside').on('tap',function(e){
                e.stopImmediatePropagation();
            });

            $('#float-button').on('tap',function(e){
                console.log('fb')
            });

            $('#config-hide-checkbox').on('change',function(){
                if(this.checked){
                    _config.hide = true;
                    model.setConfig();
                    $('.file').remove();
                    view.listLoad();
                }
                else{
                    _config.hide = false;
                    model.setConfig();
                    $('.file').remove();
                    view.listLoad();
                }
            });

            $('#config-sys-checkbox').on('change',function(){
                if(this.checked){
                    _config.sys = true;
                    model.setConfig();
                    $('.file').remove();
                    view.listLoad();
                }
                else{
                    _config.sys = false;
                    model.setConfig();
                    $('.file').remove();
                    view.listLoad();
                }
            });

            $('#config-floatButton-checkbox').on('change',function(){
                if(this.checked){
                    _config.button = true;
                    model.setConfig();
                    $('#float-button').css('display','block');
                    ae('#float-button').clear().play('fb-show');
                }
                else{
                    _config.button = false;
                    model.setConfig();
                    ae('#float-button').clear().play('fb-hide',function(){
                        $('#float-button').css('display','none')
                    });
                }
            });

            model.getSrc();

        }
    };

    return public

}();