var view = function(){

    var public = {

        pageInit: function(){

            var configHide = document.getElementById('config-hide-checkbox'),
                configSys = document.getElementById('config-sys-checkbox'),
                configFB = document.getElementById('config-floatButton-checkbox');

            $('#article').css('height',winHei - 56 + 'px');
            if(_config.hide){
                configHide.checked = 'checked'
            }
            else{
                configHide.checked = ''
            }
            if(_config.sys){
                configSys.checked = 'checked'
            }
            else{
                configSys.checked = ''
            }
            if(_config.button){
                $('#float-button').css('display','block');
                configFB.checked = 'checked'
            }
            else{
                configFB.checked = ''
            }

            controller.regEvents();

        },

        listLoad: function(){

            var list = Object.keys(_pointer),
                leng = list.length,
                ext = {
                    folder:[''],
                    text:['txt','html','css','js','json','bat','command'],
                    image:['jpg','jpeg','bmp','png','gif','svg'],
                    audio:['mp3','wav','m4a'],
                    video:['mp4','avi'],
                    other:[]
                },
                div ,type ,text ,
                fileList ,fileLeng,
                configHide = _config.hide ,configSys = _config.sys;

            function mySome(arr,str){
                var leng = arr.length,
                    _str = str.toLowerCase();
                for(var i = 0;i < leng;i++){
                    if (arr[i] === _str){
                        return true
                    }
                }
                return false
            }

            function setType(target){

                if(mySome(ext.folder,target.____extension)){
                    type.classList.add('life-type-folder');
                }
                else if(mySome(ext.text,target.____extension)){
                    type.classList.add('life-type-text');
                }
                else if(mySome(ext.image,target.____extension)){
                    type.classList.add('life-type-image');
                }
                else if(mySome(ext.audio,target.____extension)){
                    type.classList.add('life-type-audio');
                }
                else if(mySome(ext.video,target.____extension)){
                    type.classList.add('life-type-video');
                }
                else{
                    type.classList.add('life-type-other');
                }

            }
            function animateClick(e,focus){
                var wave = document.createElement('div'),
                    waveX, waveY;
                wave.classList.add('wave');
                if (focus.id.slice(4) === '') {
                    waveX = e.changedTouches[0].pageX + 'px';
                    waveY = e.changedTouches[0].pageY - 56 + 'px';
                } else {
                    waveX = e.changedTouches[0].pageX + 'px';
                    if (_pointer === _src) {
                        waveY = e.changedTouches[0].pageY - (focus.id.slice(4) * 73) - 56 + 'px'
                    }
                    else {
                        waveY = e.changedTouches[0].pageY - (focus.id.slice(4) * 73) - 129 + 'px'
                    }
                }
                wave.style.left = waveX;
                wave.style.top = waveY;
                wave.classList.add('ani-wave');
                focus.appendChild(wave);
            }
            if(_pointer !== _src){
                div = document.createElement('div');
                type = document.createElement('div');
                text = document.createElement('span');

                div.classList.add('file');
                div.id = 'back';
                type.classList.add('life-type-folder');
                text.classList.add('life-text');
                text.innerHTML = '../';
                div.appendChild(type);
                div.appendChild(text);
                $('#article').append(div);

                $(div).one('touchend',function(e){
                    var file = document.getElementsByClassName('file'),
                        fileLeng = file.length;
                    animateClick(e,this);
                    ae(file[0]).clear()._play('file-hide',function(){
                        _arrPoint.length = _arrPoint.length - 1;
                        if(_arrPoint.length === 0){
                            _pointer = _src
                        }
                        else{
                            var father = '_src';
                            for(var n = 0;n < _arrPoint.length;n++){
                                father = father + '["' + _arrPoint[n] + '"]'
                            }
                            _pointer = eval(father);
                        }
                        $('.file').remove();
                        view.listLoad();
                    });
                    for(var i = 1;i < fileLeng;i++){
                        ae(file[i]).clear()._play('file-hide')
                    }
                })
            }

            for(var i = 0 ,No = 0;i < leng;i++){

                if(list[i].substr(0,4) === '____'){
                    continue
                }
                if(!configHide && list[i].substr(0,1) === '.'){
                    continue
                }
                if(!configSys && (list[i] === 'index.html' || list[i] === 'index.haml' || list[i] === 'tree.txt' || list[i] === 'create-tree.command')){
                    continue
                }

                div = document.createElement('div');
                type = document.createElement('div');
                text = document.createElement('span');

                div.classList.add('file');
                div['src'] = list[i];
                div.id = 'file' + No;
                No = No + 1;
                setType(_pointer[list[i]]);
                text.classList.add('life-text');
                text.innerHTML = list[i];
                div.appendChild(type);
                div.appendChild(text);
                $('#article').append(div);
                if(renderStyle(text,'width',true) > (winWid - 88)){
                    var cache = text.innerHTML;
                    text.innerHTML = cache.substring(0,~~((winWid - 88) / 22)) + '...' + cache.substring(cache.length - 5,cache.length);
                }

                $(div).one('touchend',function(e){
                    var targetName = this['src'],
                        target = _pointer[targetName],
                        file = document.getElementsByClassName('file'),
                        fileLeng = file.length;
                    if(target.____extension === ''){
                        animateClick(e,this);
                        ae(file[0]).clear()._play('file-hide',function(){
                            _pointer = target;
                            _arrPoint.push(targetName);
                            $('.file').remove();
                            view.listLoad();
                        });
                        for(var i = 1;i < fileLeng;i++){
                            ae(file[i]).clear()._play('file-hide')
                        }
                    }
                    else if(mySome(ext.text,target.____extension)){
                        model.openText(JSON.stringify(target));
                    }
                    else if(mySome(ext.image,target.____extension)){
                        model.openImage(JSON.stringify(target),JSON.stringify(_pointer));
                    }
                    else if(mySome(ext.audio,target.____extension)){
                        model.openAudio(JSON.stringify(target));
                    }
                })

            }

            fileList = document.getElementsByClassName('file');
            fileLeng = fileList.length;

            for(var u = 0; u < fileLeng ;u++){
                setTimeout(function(target){
                    ae(target)._play('file-show')
                },100 * u,fileList[u])
            }

            if(_pointer === _src){
                $('#title').html(window.location.origin.replace(/^\w+:\/\//,''))
            }
            else{
                var m = '.';
                for(var n = 0;n < _arrPoint.length;n++){
                    m = m + '/' + _arrPoint[n];
                }
                if(m.length > (winWid - 72) / 16){
                    m = '...'
                }
                $('#title').html(m);
            }

        },

        addMask: function(){
            var mask = document.createElement('div');
            mask.style.height = winHei + 'px';
            mask.style.width = winWid + 'px';
            mask.style.position = 'absolute';
            mask.style.zIndex = '10';
            mask.id = 'mask';
            $('body').prepend(mask);
        },

        addConfirm: function(str,fn,no){
            var confirm = document.createElement('div');
            no = no || false;
            fn = fn || function(){};
            confirm.innerHTML = '<div>' + str + '</div><span id="confirm-yes">确认</span>';
            confirm.classList.add('confirm');
            view.addMask();
            $('#mask').css({
                'background-color':'rgba(0,0,0,0.4)',
                'z-index':'20'
            }).append(confirm).on('tap',function(e){
                if(e.target === this){
                    $('#mask').remove();
                }
            });
            $('#confirm-yes').on('tap',function(){
                console.log('!');
                $('#mask').remove();
                fn();
            });
            if(!no){
                $(confirm).append('<span id="confirm-no">取消</span>');
                $('#confirm-no').on('tap',function(){
                    $('#mask').remove();
                });
            }
            ae(confirm)._play('confirm-show');
            confirm.style.marginTop = -renderStyle(confirm,'height',true)/2 + 'px';
        }

    };

    var winHei = document.documentElement.clientHeight,
        winWid = document.documentElement.clientWidth;

    function renderStyle(ele,css,num){
        num = num || false;
        if(num){
            return +window.getComputedStyle(ele,null)[css+''].match(/\d*/)[0];
        }
        else{
            return window.getComputedStyle(ele,null)[css+'']
        }
    }

    ae('body')._add({
        id:'file-show',
        final:true,
        0:'opacity:0',
        500:'opacity:1'
    });
    ae('body')._add({
        id:'file-hide',
        final:true,
        0:'opacity:1',
        500:'opacity:0'
    });
    ae('body')._add({
        id:'confirm-show',
        final:true,
        0:'opacity:0;',
        500:'opacity:1'
    });

    return public

}();