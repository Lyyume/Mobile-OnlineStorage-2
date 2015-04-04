var controller = function(){

    var public = {
        regEvents: function(){

            var article = document.getElementById('article');

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

            $(article).on('touchstart',function(e){
                if((document.body.scrollTop === 0)){
                    touchStartY = e.targetTouches[0].pageY;
                }
                else{
                    touchStartY = e.targetTouches[0].pageY - document.body.scrollTop
                }
            }).on('touchmove',function(e){
                touchMoveY = e.targetTouches[0].pageY - touchStartY;
                if(document.body.scrollTop === 0){
                    article.style.marginTop = touchMoveY + 'px'
                }
                if(touchMoveY > 56){
                    var reText = document.getElementById('refresh-text'),
                        reImg = document.getElementById('refresh-img');
                    reText.innerHTML = '松开刷新';
                    reImg.src = './.src/img/refresh.png'
                }
            });
            article.addEventListener('touchend',function(e){
                if(article.style.marginTop){
                    e.stopPropagation();
                }
                if(article.style.marginTop.replace(/px/,'') > 56){
                    _pointer = _src;
                    $('.file').remove();
                    $('#attention').remove();
                    model.getSrc();
                    var reText = document.getElementById('refresh-text'),
                        reImg = document.getElementById('refresh-img');
                    reText.innerHTML = '下拉刷新';
                    reImg.src = './.src/img/down.png'
                }
                article.style.marginTop = null;
            },true);

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
                view.addConfirm('欢迎使用本APP！<br>这个按钮只是一个DEMO，<br>您可以在设置中关掉它！<br>作者的邮箱：<br>lianmengdi.f2e@gmail.com',function(){
                },true)
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

            $('#config-clean').on('tap',function(){
                view.addConfirm('您真的要清理本地存储吗？<br>此操作将不可恢复',function(){
                    localStorage.clear();
                })
            });

            $('#config-load').on('tap',function(){
                _pointer = _src;
                $('.file').remove();
                $('#attention').remove();
                model.getSrc();
            });

            $('.config').on('touchstart',function(e){
                e.currentTarget.style.backgroundColor = '#4FC3F7';
            }).on('touchend',function(e){
                e.currentTarget.style.backgroundColor = '#FFFFFF';
            });

            if(localStorage.getItem('src')){
                model.loadSrc();
            }
            else{
                $('#article').append('<div id="attention">未在本地缓存中找到数据<br/>请下拉刷新</div>')
            }
        }
    };

    return public

}();