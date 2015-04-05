'use strict';

module.exports = function (grunt){

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var config = {
        src: 'src',
        dist: 'dist'
    };

    grunt.initConfig({
        config: config,
        watch: {
            haml:{
                files: [
                    '<%= config.src %>/.open/{,*/}*.haml',
                    '<%= config.src %>/{,*/}*.haml'
                ],
                tasks: ['haml:go'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['<%= config.src %>/.src/css/{,*/}*.{scss,sass}'],
                tasks: ['sass:go','autoprefixer:go'],
                options: {
                    livereload: true
                }
            },
            sass2: { //.open
                files: [
                    '<%= config.src %>/.open/css/{,*/}*.{scss,sass}'
                ],
                tasks: ['sass:go2','autoprefixer:go2'],
                options: {
                    livereload: true
                }
            },
            reload: {
                files: [
                    '<%= config.src %>/.src/js/{,*/}*.js',
                    '<%= config.src %>/.src/img/{,*/}*',
                    '<%= config.src %>/.open/js/{,*/}*.js',
                    '<%= config.src %>/.open/img/{,*/}*',
                    '<%= config.src %>/.src/img/{,*/}*'
                ],
                options: {
                    livereload: true
                }
            }
        },
        haml:{
            go: {
                files: grunt.file.expandMapping(['src/*.haml','src/.open/*.haml'], './', {
                    rename: function(base, path) {
                        return base + path.replace(/\.haml$/, '.html');
                    }
                })
            }
        },
        sass:{
            go:{
                expand: true,
                cwd: '<%= config.src %>/.src/css/',
                src: ['*.{scss,sass}'],
                dest: '<%= config.src %>/.src/css/',
                ext: '.css'
            },
            go2:{ //.open
                expand: true,
                cwd: '<%= config.src %>/.open/css/',
                src: ['*.{scss,sass}'],
                dest: '<%= config.src %>/.open/css/',
                ext: '.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
            },
            go: {
                files: [{
                    expand: true,
                    cwd: 'src/.src/css/',
                    src: '{,*/}*.css',
                    dest: 'src/.src/css/'
                }]
            },
            go2: { //.open
                files: [{
                    expand: true,
                    cwd: 'src/.open/css/',
                    src: '{,*/}*.css',
                    dest: 'src/.open/css/'
                }]
            }
        },
        clean: {
            pack: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*'
                    ]
                }]
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            pack: {
                src: [
                    '<%= config.src %>/.src/js/model.js',
                    '<%= config.src %>/.src/js/view.js',
                    '<%= config.src %>/.src/js/controller.js',
                    '<%= config.src %>/.src/js/main.js'
                ],
                dest: '<%= config.dist %>/.src/js/index.js'
            }
        },
        uglify: {
            pack: {
                files: {
                    '<%= config.dist %>/.src/js/index.js':[
                        '<%= config.dist %>/.src/js/index.js'
                    ],
                    '<%= config.dist %>/.open/js/audio.js':[
                        '<%= config.dist %>/.open/js/audio/audio.js'
                    ],
                    '<%= config.dist %>/.open/js/image.js':[
                        '<%= config.dist %>/.open/js/image/image.js'
                    ],
                    '<%= config.dist %>/.open/js/text.js':[
                        '<%= config.dist %>/.open/js/text/text.js'
                    ]
                }
            }
        },
        copy: {
            pack:{
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.html',
                        '*.command',
                        '.src/img/*.png',
                        '.src/css/fonts/*.*',
                        '.src/css/*.css',
                        '.src/js/framework/*.js',
                        '.open/*.html',
                        '.open/img/*.png',
                        '.open/css/*.css',
                        '.open/js/*.js'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('go', [
        'haml:go',
        'sass:go',
        'autoprefixer:go',
        'sass:go2',
        'autoprefixer:go2',
        'watch'
    ]);

    grunt.registerTask('pack', [
        'clean:pack',
        'concat:pack',
//        'cssmin:pack',
        'copy:pack',
        'uglify:pack'
    ]);

};