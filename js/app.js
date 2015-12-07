angular.module('myApp.ToolbarControllers', [])

    /**
     *
     */
    .controller('MyController', ['$scope', function($scope) {

        $scope.var_chelou = {
            yoyo : 'tata la pute'
        };

        $scope.toolbox = {
            'position' : 'bottom',
            'style' : 'btn-danger',
            'animation' : 'animate-flip',
            'event' : 'click',
            'icon' : 'fa fa-times',
            'size' : '',
            'bar_size' : 'btn-lg',
            'bar_alignment' : 'normal',
            'adjustment' : 10,
            'tools' : [
                {icon : "fa fa-plus", style : "btn-primary", click : "myFirstFunction('tata 1')"},
                {icon : "fa fa-times", style : "btn-danger", click : "mySecondFunction('tata 2')"},
                {icon : "fa fa-times", style : "btn-danger", click : "mySecondFunction('{{var_chelou.yoyo}}')"},//{{var_chelou.yoyo}}
            ]
        };

        $scope.toolbox2 = {
            'position' : 'top',
            'style' : 'btn-success',
            'animation' : 'animate-flip',
            'event' : 'mouseover',
            'icon' : 'fa fa-terminal',
            'size' : '',
            'bar_size' : 'btn-lg',
            'bar_alignment' : 'normal',
            'adjustment' : 10,
            'tools' : [
                {icon : "fa fa-code-fork", style : "btn-success", click : "myFirstFunction({{var_chelou.yoyo}})"},
                {icon : "fa fa-codepen", style : "btn-success", click : "mySecondFunction({{var_chelou.yoyo}})"},
                {icon : "fa fa-css3", style : "btn-success", click : "mySecondFunction('tata')"},
                {icon : "fa fa-file-code-o", style : "btn-success", click : "mySecondFunction('tata')"},
                {icon : "fa fa-code", style : "btn-success", click : "mySecondFunction('tata')"},
                {icon : "fa fa-html5", style : "btn-success", click : "mySecondFunction('tata')"},
            ]
        };

        $scope.doSomething = function() {
             alert('doSomething');   
        };
        
        $scope.myFirstFunction = function(msg) {
             alert(msg + '!!! first function call!');   
        };
        
        $scope.mySecondFunction = function(msg) {
             alert(msg + '!!! second function call!');   
        };

    }])


var myApp = angular.module('myApp', [
    'angular-toolbar',
    'myApp.ToolbarControllers',
]);
