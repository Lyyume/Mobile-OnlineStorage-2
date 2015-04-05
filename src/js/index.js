var model = function(){

    var public = {
        getSrc:function(){
            var xhr = new XMLHttpRequest();
            function treeToObj(tree){
                var objTree = {},
                    arrTree,
                    arrPoint = [],
                    pointer = objTree,
                    leng,
                    buffer, depth ,_depth ,name ,hide ,target;
                arrTree = tree.replace(/.\n/,'').split(/\n/);  //tree文件按行转化为数组
                leng = arrTree.length;
                for(var i = 0; i < leng - 1; i++){
                    depth = arrPoint.length + 1;  //指针深度
                    _depth = arrTree[i].match(/[|]/g).length;  //文件深度
                    name = arrTree[i].replace(/[|]/g,'').replace(/^\s+/g,'');  //文件名
                    hide = !!name.match(/^[.]/);  //隐藏
                    function extension(str){
                        var type = str.match(/[.]/g);
                        if(type === null){
                            return ''
                        }
                        if(type.length === 1){
                            if(hide){
                                return ''
                            }
                            else{
                                return str.match(/\w+$/)[0]
                            }
                        }
                        if(type.length > 1){
                            return str.match(/\w+$/)[0]
                        }
                    }
                    function src(obj){
                        var str = '';
                        if(obj.length === 0){
                            return str
                        }
                        else{
                            for(var u = 0; u < obj.length; u++){
                                str = str + obj[u] + '/'
                            }
                            return str
                        }
                    }
                    if(_depth === depth){
                        //同级目录
                        pointer[name] = {};
                        target = pointer[name];
                        target['____name'] = name;
                        target['____extension'] = extension(name);
                        target['____src'] = './' + src(arrPoint) + name;
                        target['____hide'] = hide;
                        buffer = name;
                    }
                    else if(_depth === depth + 1){
                        //子目录
                        arrPoint.push(buffer);
                        pointer = pointer[buffer];
                        pointer[name] = {};
                        target = pointer[name];
                        target['____name'] = name;
                        target['____extension'] = extension(name);
                        target['____src'] = './' + src(arrPoint) + name;
                        target['____hide'] = hide;
                        buffer = name;
                    }
                    else if(_depth < depth){
                        //父目录
                        var up = depth - _depth;
                        arrPoint.length = arrPoint.length - up;
                        if(arrPoint.length === 0){
                            pointer = objTree;
                        }
                        else{
                            var father = 'objTree';
                            for(var n = 0;n < arrPoint.length;n++){
                                father = father + '["' + arrPoint[n] + '"]'
                            }
                            pointer = eval(father);
                        }
                        pointer[name] = {};
                        target = pointer[name];
                        target['____name'] = name;
                        target['____extension'] = extension(name);
                        target['____src'] = './' + src(arrPoint) + name;
                        target['____hide'] = hide;
                        buffer = name;
                    }
                }
                return objTree;
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        _tree = xhr.responseText;
                        _src = treeToObj(_tree);
                        localStorage.setItem('src',JSON.stringify(_src));
                        _pointer = _src;
                        _arrPoint = [];
                        view.listLoad();
                    }
                    else{
                        //处理其他响应
                    }
                }
                else{
                    //通信信息
                }
            };
            xhr.open('GET','./tree.txt',true);
            xhr.send();
        },
        loadSrc:function(){
            _src = JSON.parse(localStorage.getItem('src'));
            _pointer = _src;
            _arrPoint = [];
            view.listLoad();
        },
        getConfig:function(){
            if(!localStorage.getItem('config')){
                _config = {
                    hide : false,
                    sys : false,
                    button : true
                };
                localStorage.setItem('config',JSON.stringify(_config));
            }
            else{
                _config = JSON.parse(localStorage.getItem('config'))
            }
            view.pageInit();
        },
        setConfig:function(){
            localStorage.setItem('config',JSON.stringify(_config));
        },
        openText:function(str){
            localStorage.setItem('openText',str);
            setTimeout(function(){
                window.open('./open/text.html');
            },0);
        },
        openImage:function(str,srcStr){
            localStorage.setItem('openImage',str);
            localStorage.setItem('openImageSrc',srcStr);
            setTimeout(function(){
                window.open('./open/image.html');
            },0);
        },
        openAudio:function(str){
            localStorage.setItem('openAudio',str);
            setTimeout(function(){
                window.open('./open/audio.html');
            },0);
        }
    };

    return public

}();;var view = function(){

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

}();;var controller = function(){

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
                    reImg.src = './src/img/refresh.png'
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
                    reImg.src = './src/img/down.png'
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

}();;var _tree ,_src ,_pointer ,_arrPoint ,_config;

model.getConfig();