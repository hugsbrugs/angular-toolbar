// Define module 'angular-toolbar'
angular.module('angular-toolbar', [
    //'angular-toolbar-templates', 
    'angular-toolbar-directives'
])

// angular.module('angular-toolbar-templates', [
//     'template/angular-toolbar/toolbtn.html', 
//     'template/angular-toolbar/toolbar.html'
// ]);

/**
 *
 */
angular.module('angular-toolbar-directives', [])
    
    /**
     * http://benclinkinbeard.com/posts/creating-configurable-angular-directives-with-providers/
     */
    .provider('toolbarConfig', [function () {

        this.config = function (config) {
          this.config = config;
        };

        this.$get = function () {
          return this;
        };

    }])

    /**
     * 
     */
    .directive('toolbtn', ['$rootScope', '$compile', '$document', '$timeout', '$templateCache', '$interpolate',
    function ($rootScope, $compile, $document, $timeout, $templateCache, $interpolate) {
        return {
            replace: true,
            //require: "toolbar",//^ : ancestor element
            controllerAs: 'ctrl',
            bindToController: {
                bstyle : '@',
                event : '@',
                size : '@',
                icon : '@',
                model:'=ngModel'
            },
            restrict: 'AE',
            scope : {},
            templateUrl : '../js/templates/toolbtn.html',
            controller: function($scope, $element, $rootScope)
            {
                var ctrl = this;
                // Init variables
                ctrl.bid = ctrl.bid || ctrl.model.bid;//'1';
                ctrl.bstyle =  ctrl.bstyle || ctrl.model.bstyle || 'btn-success';
                ctrl.event =  ctrl.event || ctrl.model.event || 'click';
                ctrl.size =  ctrl.size || ctrl.model.size || '';
                ctrl.icon =  ctrl.icon || ctrl.model.icon || 'fa fa-question';
                
                // if toolbar is defined in model
                if(ctrl.model.toolbar)
                {
                    ctrl.toolbar = ctrl.model.toolbar;
                    var body = angular.element(document).find('body').eq(0);
                    var toolbar = '<toolbar ng-model="ctrl.toolbar"></toolbar>'; 
                    body.append($compile(toolbar)($scope));
                }
                

                // event
                var is_clicked = false;
                var is_hovered = false;
                ctrl.handle_event = function()
                {
                    if(ctrl.event==='mouseover')
                    {
                        $element.bind('mouseover', function (event)
                        {
                            console.log('mouseover toolbtn');
                            // if(is_hovered===false)
                            // {
                                $rootScope.$broadcast('showToolbar', [ctrl.id]);
                                //$element.unbind('mouseover');
                            //     is_hovered = true;
                            // }
                        });

                        $element.bind('mouseleave', function (event)
                        {
                            console.log('mouseleave toolbtn');
                            //$element.unbind('mouseleave');
                            // if(is_hovered===true)
                            // {
                                $rootScope.$broadcast('perhapsHideToolbar', [ctrl.id]);
                            //     is_hovered = false;
                            // }
                        });

                        /*$element.bind('mouseleave', function (event)
                        {
                            console.log('mouseleave toolbtn');
                            //$element.unbind('mouseleave');
                            $rootScope.$broadcast('perhapsHideToolbar', [ctrl.id]);
                        });*/
                        /*$element.bind('mouseenter', function (event)
                        {
                            console.log('mouseenter toolbtn');
                            //close_after_1s = false;
                            //$element.unbind('mouseenter');
                            $rootScope.$broadcast('perhapsHideToolbar', [ctrl.id]);
                        });*/
                    }
                    else
                    {
                        $element.bind('click', function ()
                        {
                            if(is_clicked === false)
                            {
                                $rootScope.$broadcast('showToolbar', [ctrl.id]);
                                is_clicked = true;
                            }
                            else
                            {
                                $rootScope.$broadcast('hideToolbar', [ctrl.id]);
                                is_clicked = false;
                            }
                        });
                    }
                };
                // init handle event (click|mouseover)
                ctrl.handle_event();

                // Watch for event change
                $scope.$watch('ctrl.model.event', function(new_event)
                {
                    // De-register old listeners                    
                    if(ctrl.event==='click')
                    {
                        $element.unbind('click');
                    }
                    if(ctrl.event==='mouseover')
                    {
                        $element.unbind('mouseover');
                        $element.unbind('mouseleave');
                    }
                    // Set new var
                    ctrl.event =  ctrl.model.event || 'click';
                    // register new events
                    ctrl.handle_event();
                });
                // Watch for style change
                $scope.$watch('ctrl.model.bstyle', function(new_style)
                {
                    ctrl.bstyle = ctrl.model.bstyle || 'btn-success';
                });
                // Watch for icon change
                $scope.$watch('ctrl.model.icon', function(new_icon)
                {
                    ctrl.icon = ctrl.model.icon || 'fa fa-question';
                });
                // Watch for size change
                $scope.$watch('ctrl.model.size', function(new_size)
                {
                    ctrl.size = ctrl.model.size || '';
                });

            },
        }
    }])

    /**
     *
     */
    .directive('toolbarbtn', ['$compile', '$document', '$timeout', '$templateCache', '$interpolate', //'$eval',
    function ($compile, $document, $timeout, $templateCache, $interpolate) {
        return {
            replace: true,
            require: "^toolbar",// ^ : ancestor element
            controllerAs: 'ctrl',
            bindToController: {
                bstyle : '@',
                click : '@',
                size : '@',
                icon : '@',
                model:'=ngModel'
            },
            restrict: 'AE',
            scope : {},
            templateUrl : '../js/templates/toolbarbtn.html',
            controller: function($scope, $element, $rootScope)
            {
                var ctrl = this;
                
                //console.log('$scope.$parent.size', $scope.$parent);

                // Init variables
                ctrl.bstyle =  ctrl.bstyle || ctrl.model.bstyle || 'btn-success';
                ctrl.click =  ctrl.click || ctrl.model.click || 'donothing';
                ctrl.size =  $scope.$parent.$parent.ctrl.size || $scope.$parent.ctrl.size || '';
                ctrl.icon =  ctrl.icon || ctrl.model.icon || 'fa fa-question';

                // Process function calls
                ctrl.myclick = function()
                {
                    $timeout(function()
                    {
                        // var funky = $interpolate(ctrl.click)($scope);
                        // console.log('funky', funky);
                        // $rootScope.$eval(funky);

                        $rootScope.$eval(ctrl.click);
                    }, 0, false);
                    
                };

                // Watch for size change
                $scope.$watch('$parent.ctrl.size', function(new_style)
                {
                    ctrl.size =  $scope.$parent.ctrl.size || '';
                });
            },
        }
    }])

    /**
     *
     */
    .directive('toolbar', ['$rootScope', '$compile', '$document', '$timeout', '$templateCache', '$interpolate', '$interval',
    function ($rootScope, $compile, $document, $timeout, $templateCache, $interpolate, $interval) {
        return {
            replace: true,
            transclude: true,
            controllerAs: 'ctrl',
            bindToController: {
                bid : '@',
                position : '@',
                tools : '@',
                alignment : '@',
                size : '@',
                model:'=ngModel'
            },
            restrict: 'AE',
            scope : {},
            templateUrl : '../js/templates/toolbar.html',
            controller: function($scope, $element, $rootScope)
            {
                var ctrl = this;
                // Init variables
                ctrl.bid =  (ctrl.bid || ctrl.model.bid);// || 'toolbar-1';
                ctrl.position = ctrl.position || ctrl.model.position || 'top';
                ctrl.tools =  ctrl.tools || ctrl.model.tools || {};
                //console.log('ctrl.tools', ctrl.tools);
                ctrl.animation = ctrl.animation || ctrl.model.animation || 'animate-standard';
                ctrl.alignment = ctrl.alignment || ctrl.model.alignment || 'normal';
                ctrl.size =  ctrl.size || ctrl.model.size || '';
                ctrl.adjustment = 10;

                ctrl.btn_group = ctrl.btn_group || ctrl.model.btn_group || 'btn-group';
                ctrl.arrow_top = ctrl.arrow_top || ctrl.model.arrow_top || false;

                var isMouseOver = false;
                $rootScope.$on('showToolbar', function(event, data) { 
                    console.log('on showToolbar', data);
                    ctrl.showToolbar();
                    
                    $element.bind('mouseover', function (event)
                    {
                        isMouseOver = true;
                    });
                    $element.bind('mouseleave', function (event)
                    {
                        isMouseOver = false;
                        $timeout(function()
                        {
                            if(!isMouseOver)
                                ctrl.hideToolbar();
                        }, 500);
                    });
                    $element.bind('mouseenter', function (event)
                    {
                        isMouseOver = true;
                    });
                    // $interval( function(){ 
                    //     if(!isMouseOver)
                    //         ctrl.hideToolbar();        
                    // }, 300);
                });

                $rootScope.$on('hideToolbar', function(event, data) { 
                    console.log('on hideToolbar', data);
                    if(!isMouseOver)
                        ctrl.hideToolbar();
                });

                $rootScope.$on('perhapsHideToolbar', function(event, data) { 
                    console.log('on perhapsHideToolbar', isMouseOver);
                    $timeout(function()
                    {
                        console.log('on perhapsHideToolbar 2', isMouseOver);
                        if(!isMouseOver)
                            ctrl.hideToolbar();
                    }, 500);
                });

                // place element at body level (absolute positioning)
                var body = angular.element(document).find('body').eq(0);
                body.append($element);

                // display toolbar
                ctrl.showToolbar = function()
                {
                    ctrl.positionToolbar();
                    $element.addClass(ctrl.animation);
                    $element.css('opacity', 1);
                };

                ctrl.hideToolbar = function()
                {
                    $element.removeClass(ctrl.animation);
                    $element.css('opacity', 0);
                };

                ctrl.positionToolbar = function()
                {
                    //console.log('ctrl.bid', ctrl.bid);
                    var my_elm = angular.element(document.getElementById('toolbar-'+ctrl.bid));
                    var coord = ctrl.getCoordinates(my_elm);
                    //console.log('toolbar coordinates : ' + JSON.stringify(coord));
                    $element.css('left', coord.left);
                    $element.css('top', coord.top);
                };

                ctrl.getCoordinates = function(toolbox)
                {                    
                    var toolbtn = angular.element(document.getElementById(ctrl.bid));
                    var toolbtn_width = typeof toolbtn[0]!=='undefined' ? toolbtn[0].offsetWidth : 0; // 37;
                    var toolbtn_height = typeof toolbtn[0]!=='undefined' ? toolbtn[0].offsetHeight : 0; // 34;

                    var coordinates = ctrl.getElementOffset(toolbtn);
                    //console.log('toolbtn coordinates: ' + JSON.stringify(coordinates));
                    var toolbar_outer_width = typeof toolbox[0]!=='undefined' ? toolbox[0].clientWidth : 0;
                    var toolbar_outer_height = typeof toolbox[0]!=='undefined' ? toolbox[0].clientHeight : 0;

                    switch(ctrl.position)
                    {
                        case 'top':
                            return{
                                left: (coordinates.left + toolbtn_width/2 - toolbar_outer_width/2) + 'px',
                                top: (coordinates.top - toolbar_outer_height - ctrl.adjustment) + 'px', 
                            };
                        case 'left':
                            return{
                                left: (coordinates.left - toolbar_outer_width - ctrl.adjustment) + 'px',
                                top: (coordinates.top + toolbtn_height/2 - toolbar_outer_height/2) + 'px',
                            };
                        case 'right':
                            return{
                                left: (coordinates.left + toolbtn_width + ctrl.adjustment ) + 'px',
                                top: (coordinates.top + toolbtn_height/2 - toolbar_outer_height/2) + 'px',
                            };
                        case 'bottom':
                            return{
                                left: (coordinates.left + toolbtn_width/2 - toolbar_outer_width/2) + 'px',
                                top: (coordinates.top + toolbtn_height + ctrl.adjustment) + 'px', 
                            };
                    }
                };

                // toolbox position
                ctrl.getElementOffset = function (toolbox)
                {
                    if(typeof toolbox[0]!=='undefined')
                    {
                        var de = document.documentElement;
                        var box = toolbox[0].getBoundingClientRect();
                        var top = box.top + window.pageYOffset - de.clientTop;
                        var left = box.left + window.pageXOffset - de.clientLeft;
                        return { top: top, left: left };
                    }
                    else
                    {
                        return { top: 0, left: 0 };
                    }
                };
                //console.log('offset : ' + JSON.stringify(scope.getElementOffset(element)));

                ctrl.get_toolbar_btn_group = function()
                {
                    if(ctrl.alignment==='normal')
                    {
                        //scope.toolbar_btn_group = 'btn-group-vertical';
                        if(ctrl.position==='top' || ctrl.position==='bottom' )
                        {
                            ctrl.arrow_top = true;
                            ctrl.btn_group = 'btn-group';
                        }
                        else
                        {
                            ctrl.arrow_top = false;
                            ctrl.btn_group = 'btn-group-vertical';
                        }
                    }
                    if(ctrl.alignment==='angle')
                    {
                        //scope.toolbar_btn_group = 'btn-group';
                        if(ctrl.position==='top' || ctrl.position==='bottom' )
                        {
                            ctrl.arrow_top = true;
                            ctrl.btn_group = 'btn-group-vertical';
                        }
                        else
                        {
                            ctrl.arrow_top = false;
                            ctrl.btn_group = 'btn-group';
                        }
                    }
                };
                ctrl.get_toolbar_btn_group();

                // Watch for animation change
                $scope.$watch('ctrl.model.animation', function(new_style)
                {
                    ctrl.animation = ctrl.model.animation || 'animate-standard';
                });
                // Watch for position change
                $scope.$watch('ctrl.model.position', function(new_style)
                {
                    ctrl.position = ctrl.model.position || 'top';
                });
                // Watch for size change
                $scope.$watch('ctrl.model.size', function(new_style)
                {
                    ctrl.size = ctrl.model.size || '';
                });
                // Watch for alignment change
                $scope.$watch('ctrl.model.alignment', function(new_style)
                {
                    ctrl.alignment = ctrl.model.alignment || 'normal';
                    ctrl.get_toolbar_btn_group();
                });
            },
        }
    }])
    
    /**
     * http://stackoverflow.com/questions/21092885/how-to-replace-the-element-with-ng-transclude
     */
    .directive('ngTranscludeReplace', ['$log', function ($log) {
        return {
            terminal: true,
            restrict: 'EA',

            link: function ($scope, $element, $attr, ctrl, transclude) {
                    if (!transclude) {
                        $log.error('orphan',
                            'Illegal use of ngTranscludeReplace directive in the template! ' +
                            'No parent directive that requires a transclusion found. ');
                        return;
                    }
                    transclude(function (clone) {
                        if (clone.length) {
                            $element.replaceWith(clone);
                        }
                        else {
                            $element.remove();
                        }
                      });
                  }
            };
        }
    ]);