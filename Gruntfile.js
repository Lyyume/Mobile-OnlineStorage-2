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
                files: ['<%= config.src %>/{,*/}*.haml'],
                tasks: ['haml:go'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['<%= config.src %>/css/{,*/}*.{scss,sass}'],
                tasks: ['sass:go','autoprefixer:go'],
                options: {
                    livereload: true
                }
            },
            reload: {
                files: [
                    '<%= config.src %>/js/{,*/}*.js',
                    '<%= config.src %>/images/{,*/}*'
                ],
                options: {
                    livereload: true
                }
            }
        },
        haml:{
            go: {
                files: grunt.file.expandMapping(['src/*.haml','src/*/*.haml'], './', {
                    rename: function(base, path) {
                        return base + path.replace(/\.haml$/, '.html');
                    }
                })
            }
        },
        sass:{
            go:{
                expand: true,
                cwd: '<%= config.src %>/css/',
                src: ['*.{scss,sass}'],
                dest: '<%= config.src %>/css/',
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
                    cwd: 'src/css/',
                    src: '{,*/}*.css',
                    dest: 'src/css/'
                }]
            }
        },
        copy:{
            test:{
                src: '<%= config.src %>/index.html',
                dest: '<%= config.dist %>/index.html'
            }
        }
    });

    grunt.registerTask('go', [
        'haml:go',
        'sass:go',
        'autoprefixer:go',
        'watch'
    ]);
};