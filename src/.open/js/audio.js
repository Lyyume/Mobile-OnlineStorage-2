var _src;

var model = function(){

    var public = {

        getData: function(){

            _src = JSON.parse(localStorage.getItem("openAudio"));

            view.pageIni();

        },

        loadAudio: function(){

            var audio = document.createElement('audio'),
                source = document.createElement('source');

            audio.controls = 'controls';
            source.src = '../' + _src.____src;
            source.type = 'audio/' + _src.____extension;
            audio.id = 'audio';
            audio.appendChild(source);
            $('#stage').append(audio);
            $('#name').html(_src.____name);

            controller.playerIni()

        }

    };

    return public

}();

var controller = function(){

    var public = {

        playerIni: function(){

            var audio = document.getElementById('audio'),
                view = document.getElementById('view'),
                play = document.getElementById('play'),
                volume = document.getElementById('volume'),
                time = document.getElementById('time'),
                name = document.getElementById('name'),
                leng = document.getElementById('leng'),
                loop = document.getElementById('loop'),
                check ,lengText;

            function audioPlay(){
                var img = document.createElement('img'),
                    playIcon = document.getElementById('play-icon');
                audio.play();
                $(play).off('tap',audioPlay);
                $(play).on('tap',audioPause);
                play.removeChild(playIcon);
                img.id = 'play-icon';
                img.src = './img/pause.png';
                play.appendChild(img);

            }
            function audioPause(){
                var img = document.createElement('img'),
                    playIcon = document.getElementById('play-icon');
                audio.pause();
                $(play).off('tap',audioPause);
                $(play).on('tap',audioPlay);
                play.removeChild(playIcon);
                img.id = 'play-icon';
                img.src = './img/play.png';
                play.appendChild(img);
            }
            function getTime(){
                if(audio.duration){
                    clearInterval(checkLoad);
                    time.max = audio.duration;
                }
            }
            function checkTime(){
                time.value = audio.currentTime;
                if ((~~audio.currentTime % 60) < 10){
                    leng.innerHTML = ~~(~~audio.currentTime / 60) + ':0' + ~~audio.currentTime % 60 + '/' +  lengText;
                }
                else{
                    leng.innerHTML = ~~(~~audio.currentTime / 60) + ':' + ~~audio.currentTime % 60 + '/' +  lengText;
                }
            }
            var checkLoad = setInterval(getTime,50);
            audio.preload = 'auto';
            time.value = audio.currentTime;
            volume.value = audio.volume * 100;

            $(audio).on('durationchange',function(){
                lengText = ~~(~~audio.duration / 60) + ':' + ~~audio.duration % 60;
                leng.innerHTML = '0:00/' + lengText;
            }).on('play',function(){
                time.value = 100;
                check = setInterval(checkTime,200);
            }).on('pause',function(){
                clearInterval(check)
            });
            $(play).on('tap',audioPlay);
            $(volume).on('change',function(){
                audio.volume = volume.value * 0.01;
            });
            $(time).on('change',function(){
                audio.currentTime = time.value;
                if ((~~audio.currentTime % 60) < 10){
                    leng.innerHTML = ~~(~~audio.currentTime / 60) + ':0' + ~~audio.currentTime % 60 + '/' +  lengText;
                }
                else{
                    leng.innerHTML = ~~(~~audio.currentTime / 60) + ':' + ~~audio.currentTime % 60 + '/' +  lengText;
                }
            }).on('touchstart',function(){
                if(!audio.paused){
                    clearInterval(check)
                }
            }).on('touchend',function(){
                if(!audio.paused){
                    check = setInterval(checkTime,200);
                }
            });
            $(loop).on('touchend',function(){
                function reset(){
                    audio.currentTime = 0;
                    audio.play();
                }
                if(this.style.opacity){
                    this.style.opacity = '';
                    $(audio).off('ended',reset);
                }
                else{
                    this.style.opacity = '0.8';
                    $(audio).on('ended',reset);
                }
            })

        }

    };

    return public

}();

var view = function(){

    var public = {

        pageIni: function(){

            play.style.width = winWid + 'px';
            play.style.height = winWid + 'px';
            control.style.height = winWid / 3 + 'px';
            control.style.top = winWid + 20 + 'px';
            view.style.top = (winHei - winWid / 3 * 4 - 20) / 2 + 'px';

            model.loadAudio();

        }

    };

    var view = document.getElementById('view'),
        play = document.getElementById('play'),
        control = document.getElementById('control'),

        winHei = document.documentElement.clientHeight,
        winWid = document.documentElement.clientWidth;

    return public

}();

model.getData();