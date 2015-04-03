var _src ,_image ,_list ,_pointer;

var model = function(){

    var public = {

        getData: function(){

            _src = JSON.parse(localStorage.getItem("openImageSrc"));
            _image = JSON.parse(localStorage.getItem("openImage"));
            _list = Object.keys(_src).filter(function(str){
                return !!str.match(/.jpg$/) || !!str.match(/.png$/) || !!str.match(/.bmp$/)
            });
            _pointer = _list.indexOf(_image.____name);

            view.pageInit();

        },

        getImage: function(){

            var img = document.createElement('img');

            img.src = '../' + _src.____src + '/' + _list[_pointer];
            img.classList.add('pointer');
            getImgSize(img.src,function(wid,hei){
                setImgConfig(wid,hei,img);
                view.loadImage(img)
            })

        },

        bufferNext: function(){

            var img = document.createElement('img');

            img.src = '../' + _src.____src + '/' + _list[_pointer + 1];
            img.classList.add('next');
            getImgSize(img.src,function(wid,hei){
                setImgConfig(wid,hei,img);
                $('#stage').append(img);
                img.style.left = winWid + 'px';
            });

        },

        bufferLast: function(fn) {

            var img = document.createElement('img');

            img.src = '../' + _src.____src + '/' + _list[_pointer - 1];
            img.classList.add('last');
            getImgSize(img.src,function(wid,hei){
                setImgConfig(wid,hei,img);
                $('#stage').append(img);
                img.style.left = -winWid + 'px';
            });

            fn(img);

        }

    };

    var winHei = document.documentElement.clientHeight,
        winWid = document.documentElement.clientWidth;

    function getImgSize(src,fn){

        var img = new Image(),
            height ,width;

        img.src = src;
        var check = function(){
            if(img.width>0 || img.height>0){
                height = img.height;
                width = img.width;
                clearInterval(set);
                fn(width,height);
            }
        };
        var set = setInterval(check,40);

    }

    function setImgConfig(wid,hei,img){

        if(winWid < wid){
            img.width = winWid;
            img.style.top = (winHei - 24 - winWid / wid * hei) / 2 + 'px';
        }
        else{
            img.style.top = (winHei - 24 - hei) / 2 + 'px';
            img.style.paddingLeft = (winWid - wid) / 2 + 'px'
        }

    }

    return public

}();

var controller = function(){

    var public = {
        regEvent: function(){

            $('#touch').on('swipeLeft',function(){
                view.last();
            }).on('swipeRight',function(){
                view.next();
            });
            $('#left').on('singleTap',function(e){
                view.last();
            }).on('doubleTap',function(){
                view.enlarge();
            });
            $('#right').on('singleTap',function(e){
                view.next();
            }).on('doubleTap',function(){
                view.enlarge();
            });

            if(!(_pointer === _list.length - 1)){
                model.bufferNext();
            }

        }

    };

    return public

}();

var view = function(){

    var public = {

        pageInit: function(){

            $('#stage').css({
                'width':winWid + 'px',
                'height':winHei - 24 + 'px'
            });
            $('#view').css({
                'width':winWid + 'px',
                'height':winHei + 'px'
            });
            $('#touch').css({
                'width':winWid + 'px',
                'height':winHei - 24 + 'px'
            });

            model.getImage();

        },

        loadImage: function(img){

            $('#stage').append(img);
            $('#name').html(_list[_pointer]);
            $('#number').html((_pointer + 1) + '/' + _list.length);

            controller.regEvent();

        },

        next: function(){

            if(!!document.getElementsByClassName('next')[0] && _pointer !== _list.length){

                var thisImg = document.getElementsByClassName('pointer')[0],
                    nextImg = document.getElementsByClassName('next')[0];

                ae(thisImg)._play('leftOut',function(){
                    $(thisImg).remove();
                    ae(nextImg)._play('rightIn',function(){
                        nextImg.style.left = '0px';
                        ae(nextImg).clear();
                    });
                    _pointer = _pointer + 1;
                    $('#name').html(_list[_pointer]);
                    $('#number').html((_pointer + 1) + '/' + _list.length);
                    if(!(_pointer === _list.length - 1)){
                        model.bufferNext();
                    }
                });
                $(nextImg).removeClass('next').addClass('pointer');

            }

        },

        last: function(){

            if((!!document.getElementsByClassName('next')[0] && _pointer !== 0) || _pointer === _list.length - 1){

                var thisImg = document.getElementsByClassName('pointer')[0],
                    nextImg = document.getElementsByClassName('next')[0];

                function goLast(img){
                    img.classList.remove('last');
                    img.classList.add('pointer');
                    ae(img)._play('leftIn',function(){
                        img.style.left = '0px';
                        ae(img).clear();
                        _pointer = _pointer - 1;
                        $('#name').html(_list[_pointer]);
                        $('#number').html((_pointer + 1) + '/' + _list.length);
                        if(!(_pointer === _list.length - 1)){
                            model.bufferNext();
                        }
                    })
                }

                if(nextImg){
                    $(nextImg).remove();
                }
                ae(thisImg)._play('rightOut',function(){
                    $(thisImg).remove();
                    model.bufferLast(goLast);
                });

            }

        },

        enlarge: function(){

            console.log('enlarge');
            var thisImg = document.getElementsByClassName('pointer')[0],
                nextImg = document.getElementsByClassName('next')[0],
                timer = 0;

            function ImgSize(){
                var img = new Image();
                img.src = thisImg.src;
                $(img).on('load',function(){
                    if(img.width > thisImg.width){
                        thisImg.width = img.width;
                        $('#stage').css('overflow','visible');
                        if(nextImg){
                            nextImg.style.display = 'none';
                        }
                        $('#touch').on('touchstart',back)
                    }
                })
            }
            function back(e){
                e.stopImmediatePropagation();
                timer = timer + 1;
                if(timer === 2){
                    thisImg.width = winWid;
                    $('#stage').css('overflow','hidden');
                    if(nextImg){
                        nextImg.style.display = 'block';
                    }
                    $('#touch').off('touchstart',back)
                }
                setTimeout(function(){
                    timer = 0;
                },300)
            }

            ImgSize();

        }

    };

    var winHei = document.documentElement.clientHeight,
        winWid = document.documentElement.clientWidth;

    ae('body')._add({
        id:'leftIn',
        final:true,
        0:{
            'margin-left': '0px'
        },
        300:{
            'margin-left': winWid + 'px'
        }
    })._add({
        id:'rightIn',
        final:true,
        0:{
            'margin-left': '0px'
        },
        300:{
            'margin-left': -winWid + 'px'
        }
    })._add({
        id:'leftOut',
        final:true,
        0:{
            'margin-left': '0px'
        },
        300:{
            'margin-left': -winWid + 'px'
        }
    })._add({
        id:'rightOut',
        final:true,
        0:{
            'margin-left': '0px'
        },
        300:{
            'margin-left': winWid + 'px'
        }
    });

    return public

}();

model.getData();