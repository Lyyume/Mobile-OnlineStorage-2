var _src ,_text;

var model = function(){

    var public = {
        getConfig: function(){
            if(!localStorage.getItem('textConfig')){
                _config = {
                    night : false,
                    size : false,
                    format : false
                };
                localStorage.setItem('textConfig',JSON.stringify(_config));
            }
            else{
                _config = JSON.parse(localStorage.getItem('textConfig'))
            }
            view.pageInit();
        },
        saveConfig: function(){
            localStorage.setItem('textConfig',JSON.stringify(_config))
        },
        getText: function(){
            var xhr = new XMLHttpRequest();
            _src = JSON.parse(localStorage.getItem("openText"));
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        _text = xhr.responseText;
                        view.loadText();
                    }
                    else{

                    }
                }
                else{

                }
            };
            xhr.open('GET','../' + _src.____src,true);
            xhr.send();
        },
        saveMark: function(num){
            localStorage.setItem('textMark' + num ,document.body.scrollTop);
            view.showMsg('书签' + num + '存储成功');
        },
        loadMark: function(num){
            document.body.scrollTop = localStorage.getItem('textMark' + num);
            view.showMsg('书签' + num + '载入成功');
        }
    };

    return public

}();

var controller = function(){

    var public = {
        regEvents: function(){

            $('#moreVert').on('tap',function(){
                view.addMask();
                ae('#configCard').clear().play('config-show');
                $('#mask').css('background-color','rgba(0,0,0,0.2)').on('tap',function(){
                    ae('#configCard').clear().play('config-hide',function(){
                        $('#markCard').remove();
                    });
                    $('#mask').remove();
                })
            });

            $('#configSave').on('tap',function(e){
                var markCard = document.createElement('div');
                markCard.id = 'markCard';
                markCard.innerHTML = '<div class="mark">书签1</div><div class="mark">书签2</div><div class="mark">书签3</div>';
                $('#markCard').remove();
                this.appendChild(markCard);
                ae(markCard)._play('mark-show');
                $('.mark').on('tap',function(e){
                    model.saveMark(this.innerHTML[2]);
                    console.log('!');
                    e.stopPropagation();
                }).on('touchstart',function(e){
                    e.currentTarget.style.backgroundColor = '#4FC3F7'
                }).on('touchend',function(e){
                    e.currentTarget.style.backgroundColor = '#FFFFFF'
                });

            });

            $('#configLoad').on('tap',function(e){
                var markCard = document.createElement('div');
                markCard.id = 'markCard';
                markCard.innerHTML = '<div class="mark">书签1</div><div class="mark">书签2</div><div class="mark">书签3</div>';
                $('#markCard').remove();
                this.appendChild(markCard);
                markCard.style.top = '40px';
                ae(markCard)._play('mark-show');
                $('.mark').on('tap',function(e){
                    model.loadMark(this.innerHTML[2]);
                    e.stopImmediatePropagation();
                }).on('touchstart',function(e){
                    e.currentTarget.style.backgroundColor = '#4FC3F7'
                }).on('touchend',function(e){
                    e.currentTarget.style.backgroundColor = '#FFFFFF'
                });
            });
            $('#configNight').on('tap',function(e){
                _config.night = !_config.night;
                model.saveConfig();
                view.pageReload();
            });
            $('#configSize').on('tap',function(e){
                _config.size = !_config.size;
                model.saveConfig();
                view.pageReload();
            });
            $('#configFormat').on('tap',function(e){
                _config.format = !_config.format;
                model.saveConfig();
                view.pageReload();
            });

            $('.config').on('touchstart',function(e){
                if(this === e.target){
                    e.currentTarget.style.backgroundColor = '#4FC3F7'
                }
            }).on('touchend',function(e){
                if(this === e.target){
                    e.currentTarget.style.backgroundColor = '#FFFFFF'
                }
            });

            model.getText();
        }
    };

    ae('#configCard').add({
        id:'config-show',
        'final':true,
        0:{
            bottom:'-220px',
            opacity:'0'
        },
        500:{
            bottom:'0px',
            opacity:'0.94'
        },
        'curve':'cubic-bezier(0,0,.22,1)'
    });
    ae('#configCard').add({
        id:'config-hide',
        'final':true,
        0:{
            bottom:'0px',
            opacity:'0.94'
        },
        500:{
            bottom:'-220px',
            opacity:'0'
        },
        'curve':'cubic-bezier(.63,0,1,1)'
    });
    ae('body')._add({
        id:'mark-show',
        'final':true,
        0:{
            left:'0px',
            opacity:'0'
        },
        500:{
            left:'-73px',
            opacity:'1'
        },
        'curve':'cubic-bezier(0,0,.22,1)'
    });
    ae('body')._add({
        id:'mark-hide',
        'final':true,
        0:{
            left:'-73px',
            opacity:'1'
        },
        500:{

            left:'0px',
            opacity:'0'
        },
        'curve':'cubic-bezier(.63,0,1,1)'
    });

    return public

}();

var view = function(){

    var public = {
        pageInit: function(){
            view.style.width = winWid + 'px';
            stage.style.width = winWid - 32 + 'px';

            if(_config.night){
                stage.style.backgroundColor = '#444444';
                stage.style.color = '#CCCCCC';
                curtain.style.backgroundColor = '#444444';
                curtain.style.color = '#CCCCCC';
                moreVert.src = './img/more_vert_white.png'
            }
            if(_config.size){
                stage.style.fontSize = '20px';
            }

            controller.regEvents();
        },
        pageReload: function(){
            if(_config.night){
                stage.style.backgroundColor = '#444444';
                stage.style.color = '#CCCCCC';
                curtain.style.backgroundColor = '#444444';
                curtain.style.color = '#CCCCCC';
                moreVert.src = './img/more_vert_white.png';
            }
            else{
                stage.style.backgroundColor = '#FFFFFF';
                stage.style.color = '#000000';
                curtain.style.backgroundColor = '#FFFFFF';
                curtain.style.color = '#000000';
                moreVert.src = './img/more_vert.png';
            }
            if(_config.size){
                stage.style.fontSize = '20px';
            }
            else{
                stage.style.fontSize = '16px';
            }
            if(_config.format){
                stage.innerHTML = _text.replace(/ */g,'');
            }
            else{
                stage.innerHTML = _text;
            }
        },
        addMask: function(){
            var mask = document.createElement('div');
            mask.style.height = document.body.scrollHeight + 'px';
            mask.style.width = winWid + 'px';
            mask.style.position = 'absolute';
            mask.style.zIndex = '10';
            mask.id = 'mask';
            $('body').prepend(mask);
        },
        loadText: function(){
            if(_config.format){
                stage.innerHTML = _text.replace(/ */g,'');
            }
            else{
                stage.innerHTML = _text;
            }
            $('#name').html(_src.____name);
            document.title = _src.____name
        },
        showMsg: function(str){
            $('#message').html(str);
            ae('#message').play();
        }
    };

    var winHei = document.documentElement.clientHeight,
        winWid = document.documentElement.clientWidth,
        view = document.getElementById('view'),
        stage = document.getElementById('stage'),
        curtain = document.getElementById('curtain'),
        moreVert = document.getElementById('moreVert');

    ae('#message').add({
        0:{opacity:1},
        1000:{opacity:1},
        2000:{opacity:0}
    });

    return public

}();

model.getConfig();