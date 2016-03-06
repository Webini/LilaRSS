module.exports = function(grunt){
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
    
    grunt.initConfig({
        eslint: {
            target: [
                'models/*.js',
                'services/*.js',
                'workers/*.js',
                'controllers/*.js',
                'test/**/*.js',
                'exceptions/*.js',
                'app.js'
            ],
            options: {
                envs: [ 'es6' ]
            }
        },
        watch: {
            eslint: {
                files: [
                    'models/*.js',
                    'services/*.js',
                    'workers/*.js',
                    'controllers/*.js',
                    'test/**/*.js',
                    'exceptions/*.js',
                    'app.js'
                ], 
                tasks: [ 'eslint', 'beep:error' ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-beep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('default', ['watch']);
};