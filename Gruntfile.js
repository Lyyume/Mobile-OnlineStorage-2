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
                files: ['<%= config.src %>/.src/css/{,*/}*.{scss,sass}'],
                tasks: ['sass:go','autoprefixer:go'],
                options: {
                    livereload: true
                }
            },
            reload: {
                files: [
                    '<%= config.src %>/.src/js/{,*/}*.js',
                    '<%= config.src %>/.src/css/{,*/}*.css',
                    '<%= config.src %>/.src/img/{,*/}*'
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
                cwd: '<%= config.src %>/.src/css/',
                src: ['*.{scss,sass}'],
                dest: '<%= config.src %>/.src/css/',
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