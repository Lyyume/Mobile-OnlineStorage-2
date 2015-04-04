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
                window.open('./.open/text.html');
            },0);
        },
        openImage:function(str,srcStr){
            localStorage.setItem('openImage',str);
            localStorage.setItem('openImageSrc',srcStr);
            setTimeout(function(){
                window.open('./.open/image.html');
            },0);
        },
        openAudio:function(str){
            localStorage.setItem('openAudio',str);
            setTimeout(function(){
                window.open('./.open/audio.html');
            },0);
        }
    };

    return public

}();