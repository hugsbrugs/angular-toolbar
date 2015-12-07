
angular.module('angular-toolbar', ['angular-toolbar-templates', 'angular-toolbar-directives'])
angular.module('angular-toolbar-templates', ['template/angular-toolbar/toolbtn.html', 'template/angular-toolbar/toolbar.html']);

angular.module('angular-toolbar-directives', [])

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
    .directive('toolbar', ['$compile', '$document', '$timeout', '$templateCache', '$interpolate',
    function ($compile, $document, $timeout, $templateCache, $interpolate) {
        return {
            restrict: 'E',
            // scope : {
            //     position : '@',
            //     style : '@',
            //     animation : '@',
            //     event : '@',
            //     tools: '@'
            // },
            // A cause des fonctions appelées
            scope : true,

            templateUrl : 'template/angular-toolbar/toolbtn.html',
            replace: true,

            link: function (scope, element, attrs)
            {
                // DESTROY TOOLBAR
                // $scope.$on('$destroy', function() {$timeout.cancel(timeoutPromise);});

                // Get toolbar css style class
                scope.get_toolbar_style = function()
                {
                    var toolbar_syle = 'btn-default';
                    var available_styles = ['btn-default', 'btn-success', 'btn-primary', 'btn-info', 'btn-danger', 'btn-warning'];
                    if( available_styles.indexOf(attrs.style)>-1 )
                    {
                        toolbar_syle = attrs.style;
                    }
                    return toolbar_syle;
                };

                // default values
                scope.toolbtn_event = attrs.event || 'mouseover';
                scope.toolbar_icon = attrs.icon || 'fa fa-question-circle';
                scope.toolbar_position = attrs.position || 'top';
                scope.toolbar_animation = attrs.animation || 'animate-flip';
                scope.toolbtn_size = attrs.size || '';
                scope.toolbar_size = attrs.barSize || '';
                scope.toolbar_align = attrs.barAlign || 'normal';

                scope.toolbar_id = 'toolbar-1';
                scope.toolbtn_id = 'toolbtn-1';

                scope.toolbar_style = scope.get_toolbar_style();
                scope.tools = scope.$eval(attrs.tools);


                scope.arrow_top = false;
                scope.toolbar_btn_group = 'btn-group';

                // scope.toolbar_btn_group = 'btn-group-vertical';
                // if(attrs.position==='top' || attrs.position==='bottom' )
                // {
                //     scope.arrow_top = true;
                //     scope.toolbar_btn_group = 'btn-group';
                // }

                scope.get_toolbar_btn_group = function()
                {
                    if(scope.toolbar_align==='normal')
                    {
                        //scope.toolbar_btn_group = 'btn-group-vertical';
                        if(attrs.position==='top' || attrs.position==='bottom' )
                        {
                            scope.arrow_top = true;
                            scope.toolbar_btn_group = 'btn-group';
                        }
                        else
                        {
                            scope.arrow_top = false;
                            scope.toolbar_btn_group = 'btn-group-vertical';
                        }
                    }
                    if(scope.toolbar_align==='angle')
                    {
                        //scope.toolbar_btn_group = 'btn-group';
                        if(attrs.position==='top' || attrs.position==='bottom' )
                        {
                            scope.arrow_top = true;
                            scope.toolbar_btn_group = 'btn-group-vertical';
                        }
                        else
                        {
                            scope.arrow_top = false;
                            scope.toolbar_btn_group = 'btn-group';
                        }
                    }
                };
                scope.get_toolbar_btn_group();


                //console.log(JSON.stringify(element));
                //console.log('link : ' + element.html());
                var original_element = angular.copy(element.html());
                var toolbox = null;


                // event
                var is_clicked = false;
                var is_hovered = false;
                scope.handle_event = function()
                {
                    if(scope.toolbtn_event==='mouseover')
                    {
                        element.bind('mouseover', function (event)
                        {
                            scope.showToolbar();
                            scope.listenToMouse();
                        });
                    }
                    else
                    {
                        element.bind('click', function ()
                        {
                            if(is_clicked === false)
                            {                    
                                scope.showToolbar();
                                is_clicked = true;
                            }
                            else
                            {
                                scope.hideToolbar();
                                is_clicked = false;
                            }
                        });
                    }
                };
                scope.handle_event();

                scope.listenToMouse = function()
                {
                    var close_after_1s = false;
                    element.bind('mouseleave', function ()
                    {
                        //console.log('mouseleave');
                        close_after_1s = true;
                        element.unbind('mouseleave');
                    });
                    toolbox.bind('mouseenter', function (event)
                    {
                        //console.log('mouseenter');
                        close_after_1s = false;
                        toolbox.unbind('mouseenter');
                    });

                    // wait 1 second and check if mouse is over toolbox
                    $timeout(function()
                    {
                        // if yes : listen to toolbox mouseout
                        // if no : close toolbox
                        //console.log('close_after_1s : ' + close_after_1s);
                        if(close_after_1s)
                        {
                            scope.hideToolbar();
                        }
                        else
                        {
                            toolbox.bind('mouseleave', function (event)
                            {
                                scope.hideToolbar();
                            });
                        }
                    
                    }, 1000);

                };

              
                // Watch for event change
                /*attrs.$observe('event', function(new_event)
                {
                    // De-register old listeners                    
                    if(scope.toolbtn_event==='click')
                    {
                        element.unbind('click');
                    }
                    if(scope.toolbtn_event==='mouseover')
                    {
                        element.bind('mouseover');
                        element.unbind('mouseleave');
                        // toolbox.unbind('mouseenter');
                        // toolbox.unbind('mouseleave');
                    }
                    // Set new var
                    scope.toolbtn_event = attrs.event || 'mouseover';
                    // register new events
                    scope.handle_event();
                });*/
                // Watch for style change
                attrs.$observe('style', function(new_style)
                {
                    if(new_style)
                    {
                        // console.log('UPDATE STYLE : ' + new_style);
                        // scope.build_toolbar_button();
                        scope.toolbar_style = scope.get_toolbar_style();
                    }
                });

                // Watch for position change
                attrs.$observe('position', function(new_position)
                {
                    if(new_position)
                    {
                        // console.log('UPDATE POSITION : ' + new_position);
                        // scope.build_toolbar_button();
                        // if(attrs.position==='top' || attrs.position==='bottom' )
                        // {
                        //     scope.arrow_top = true;
                        //     scope.toolbar_btn_group = 'btn-group';
                        // }
                        // else
                        // {
                        //     scope.arrow_top = false;
                        //     scope.toolbar_btn_group = 'btn-group-vertical';
                        // }

                        scope.get_toolbar_btn_group();

                        scope.toolbar_position = attrs.position || 'top';

                        scope.positionToolbar();
                    }
                });
                attrs.$observe('barAlign', function(new_align)
                {
                    console.log('UPDATE barAlign : ' + new_align);
                    if(new_align)
                    {
                        

                        scope.toolbar_align = attrs.barAlign || 'normal';
                        scope.get_toolbar_btn_group();
                        scope.positionToolbar();
                        //scope.build_toolbar();
                    }
                });
                // Watch for icon change
                attrs.$observe('icon', function(new_icon)
                {
                    if(new_icon)
                    {
                        // console.log('UPDATE ICON : ' + new_icon);
                        scope.toolbar_icon = attrs.icon || 'fa fa-question-circle';
                    }
                });
                // Watch for size change
                attrs.$observe('size', function(new_size)
                {
                    scope.toolbtn_size = attrs.size || '';
                    //console.log('UPDATE SIZE : ' + scope.toolbtn_size + ' | ' + new_size);
                });
                // Watch for size change
                attrs.$observe('barSize', function(new_size)
                {
                    //scope.toolbtn_size = attrs.size || '';
                    scope.toolbar_size = attrs.barSize || '';
                    //console.log('UPDATE SIZE : ' + new_size);
                    scope.build_toolbar();
                });
                // Watch for animation change
                attrs.$observe('animation', function(new_animation)
                {
                    scope.toolbar_animation = attrs.animation || 'animate-flip';
                    console.log('UPDATE ANIMATION : ' + new_animation);
                    scope.build_toolbar();
                });

                

                
                // display toolbar
                scope.showToolbar = function()
                {

                    // if(toolbox===null)
                    // {
                        scope.positionToolbar();
                    //}
                    //toolbox.css('display', 'block');
                    toolbox.addClass(scope.toolbar_animation);
                    toolbox.css('opacity', 1);
                };

                scope.hideToolbar = function()
                {
                    //toolbox = angular.element(document.getElementById(scope.toolbar_id));

                    toolbox.removeClass(scope.toolbar_animation);
                    //toolbox.css('display', 'none');
                    toolbox.css('opacity', 0);
                };

                scope.positionToolbar = function()
                {
                    // 1. retrive toolbar for DOM id
//                    toolbox = angular.element(document.getElementById(scope.toolbar_id));
                    // 2. build html, compile add to DOM
                    // toolbox = angular.element(html_toolbox);
                    // var body = angular.element(document).find('body').eq(0);
                    // body.append($compile(toolbox)(scope));
                    // 3. compile template and add to DOM
                    
                    toolbox = angular.element(document.getElementById(scope.toolbar_id));

                    var coord = scope.getCoordinates(toolbox);
                    console.log('toolbar coordinates : ' + JSON.stringify(coord));

                    toolbox.css('left', coord.left);
                    toolbox.css('top', coord.top);
                    //toolbox.css('right', coord.right);
                    //toolbox.css('width', coord.width);
                    //toolbox.css('position', coord.position);
                };






                // toolbox position
                scope.getElementOffset = function (toolbox)
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

                scope.getCoordinates = function(toolbox)
                {                    
                    var toolbtn = angular.element(document.getElementById(scope.toolbtn_id));
                    // console.log('toolbtn[0].offsetWidth : ' + toolbtn[0].offsetWidth);
                    // console.log('toolbtn[0].offsetHeight : ' + toolbtn[0].offsetHeight);
                    var toolbtn_width = typeof toolbtn[0]!=='undefined' ? toolbtn[0].offsetWidth : 0; // 37;
                    var toolbtn_height = typeof toolbtn[0]!=='undefined' ? toolbtn[0].offsetHeight : 0; // 34;

                    var position = attrs.position;
                    var adjustment = parseInt(attrs.adjustment);

//                    var coordinates = scope.getElementOffset(element);
                    var coordinates = scope.getElementOffset(toolbtn);
                    console.log('toolbtn coordinates: ' + JSON.stringify(coordinates));

                    // console.log('toolbox[0].offsetWidth : ' + toolbox[0].offsetWidth);
                    // console.log('toolbox[0].offsetHeight : ' + toolbox[0].offsetHeight);
                    
                    var toolbar_outer_width = typeof toolbox[0]!=='undefined' ? toolbox[0].clientWidth : 0;
                    var toolbar_outer_height = typeof toolbox[0]!=='undefined' ? toolbox[0].clientHeight : 0;
                    // console.log('toolbox[0].clientWidth : ' + toolbox[0].clientWidth);
                    // console.log('toolbox[0].clientHeight : ' + toolbox[0].clientHeight);
                    // console.log('toolbox[0].offsetWidth : ' + toolbox[0].offsetWidth);
                    // console.log('toolbox[0].offsetHeight : ' + toolbox[0].offsetHeight);

                    // if (attrs.adjustment && attrs.adjustment[attrs.position]) {
                    //     adjustment = self.options.adjustment[attrs.position] + adjustment;
                    // }

                    switch(position)
                    {
                        case 'top':
                            return{
                                left: (coordinates.left + toolbtn_width/2 - toolbar_outer_width/2) + 'px',
                                top: (coordinates.top - toolbar_outer_height - adjustment) + 'px', 
                                //right: 'auto',
                                //width: 'auto',
                                //position: 'absolute'
                            };
                        case 'left':
                            return{
                                left: (coordinates.left - toolbar_outer_width - adjustment) + 'px',
                                top: (coordinates.top + toolbtn_height/2 - toolbar_outer_height/2) + 'px',
                                //right: 'auto',
                                //width: 'auto',
                                //position: 'absolute'
                            };
                        case 'right':
                            return{
                                left: (coordinates.left + toolbtn_width + adjustment ) + 'px',
                                top: (coordinates.top + toolbtn_height/2 - toolbar_outer_height/2) + 'px',
                                //right: 'auto',
                                //width: 'auto',
                                //position: 'absolute'
                            };
                        case 'bottom':
                            return{
                                left: (coordinates.left + toolbtn_width/2 - toolbar_outer_width/2) + 'px',
                                top: (coordinates.top + toolbtn_height + adjustment) + 'px', 
                                //right: 'auto',
                                //width: 'auto',//(toolbar_outer_width+1) + 'px',
                                //position: 'absolute'
                            };
                    }
                };

                scope.build_toolbar = function()
                {
                    toolbox = $templateCache.get('template/angular-toolbar/toolbar.html');
                    var body = angular.element(document).find('body').eq(0);
                    body.append($compile(toolbox)(scope));
                };

                scope.build_toolbar();

                /*scope.click = function(func)
                {
                    console.log(func);
                    var funky = $interpolate(func);
                    console.log(funky);
                    scope.$eval(funky);

                    //$scope["functionName"](arguments);
                }*/

                // create toolbutton
                /*scope.build_toolbar_button = function()
                {
                    var html = '';
                    html += '<div class="btn '+scope.get_toolbar_style()+'">';
                        html += '<i class="'+attrs.icon+'"></i>';
                    html += '</div>';
                    element.html(html);



                    // create toolbox
                    var html_toolbox = '';
                    html_toolbox += '<div id="coucou" class="tool-container tool-'+attrs.position+' toolbar-info-o animate-standard" style="position:absolute;opacity:0;left:0px;top:0px;right:auto;">';
                        
                        // tool items
                        html_toolbox += '<div class="tool-items">';

                            var tools = scope.$eval(attrs.tools);
                            angular.forEach(tools, function(tool)
                            {
                                console.log('tool : ' + JSON.stringify(tool));
                                html_toolbox += '<a href="#" class="tool-item btn btn-'+tool.style+'" ng-click="'+tool.click+'"><i class="'+tool.icon+'"></i></a>';
                            });

                        html_toolbox += '</div>';



                    // toolbox arrow
                    scope.arrow_top = false;
                    if(attrs.position==='top' || attrs.position==='bottom' )
                    {
                        scope.arrow_top = true;
                        html_toolbox += '<div class="arrow" style="left: 50%; right: 50%;"></div>';
                    }
                    else
                    {
                        html_toolbox += '<div class="arrow"></div>';
                    }
                    html_toolbox += '</div>';
                    toolbox = angular.element(html_toolbox);



                    // hide toolbox on click
                    // toolbox.bind('click', function ()
                    // {
                    //     scope.hideToolbar();
                    // });

                    var body = angular.element(document).find('body').eq(0);
                    body.append($compile(toolbox)(scope));

                    // set good coordinates
                    var coord = scope.getCoordinates(toolbox);
                    console.log('coordinates : ' + JSON.stringify(coord));
                    toolbox.css('left', coord.left + 'px');
                    toolbox.css('top', coord.top + 'px');
                    toolbox.css('right', 'auto');

                };*/

                // Initialise toolbox
                //scope.build_toolbar_button();

            },
            
            /**
             * http://stackoverflow.com/questions/19930392/how-to-use-a-model-property-as-variable-ng-click
             * http://stackoverflow.com/questions/14881698/using-variables-in-ng-click-in-a-directive-and-compile
             */
            controller: function($scope, $element)
            {
                $scope.click = function(func)
                {
                    console.log(func);
                    var funky = $interpolate(func)($scope);
                    console.log(funky);
                    $scope.$eval(funky);//'mySecondFunction("cucu")'
                    
                    // var args = $interpolate('{{var_chelou.yoyo}}')($scope);
                    // $scope["mySecondFunction"](args);

                }
           }
        }
    }])

    /**
     *
     */
    // .directive("tool", [function($compile){
    //     return{
    //         transclude: true,
    //         replace : true,
    //         restrict : 'E',
    //         scope : {
    //             icon : '@',
    //             style : '@',
    //             click : '&'
    //         },
    //         template : '<a href="#" class="tool-item btn-{{style}}" ng-click="click()"><i class="{{icon}}"></i></a>',
    //     }
    // }]);


angular.module('template/angular-toolbar/toolbtn.html', []).run(["$templateCache", function($templateCache) {
  $templateCache.put('template/angular-toolbar/toolbtn.html',
    "<div class=\"test\">\n" + // style=\"display:inline-block;\"
        // button
        "<div id=\"{{toolbtn_id}}\" class=\"btn {{toolbar_style}} {{toolbtn_size}}\">\n" + 
            "<i class=\"{{toolbar_icon}}\"></i>\n" + 
        "</div>\n" + 
        //"<div class=\"clearfix\"></div>\n" + 
        // bar // '+attrs.position+' '+attrs.icon+'
        /*"<div id=\"{{toolbar_id}}\" class=\"tool-container tool-{{toolbar_position}} toolbar-info-o \" style=\"position:absolute;opacity:0;left:0px;top:0px;right:auto;\">\n" +
            "<div class=\"{{toolbar_btn_group}}\">\n" +//tool-items
                //"<a ng-repeat=\"tool in tools\" href=\"#\" class=\"tool-item btn btn-{{tool.style}}\" ng-click=\"tool.click\"><i class=\"{{tool.icon}}\"></i></a>\n" +
                "<button type=\"button\" ng-repeat=\"tool in tools track by $index\" href=\"#\" class=\"btn {{tool.style}}\" ng-click=\"{{tool.click}}\"><i class=\"{{tool.icon}}\"></i></button>\n" + // tool-item 
            "</div>\n" +
            "<div class=\"arrow\" ng-class=\"{{arrow_top}}\"></div>\n" + // ng-class=\"{{'arrow-top':arrow_top}}
        "</div>\n" +*/
    "</div>\n" +
    "");
}]);



angular.module('template/angular-toolbar/toolbar.html', []).run(["$templateCache", function($templateCache) {
  $templateCache.put('template/angular-toolbar/toolbar.html',
    "<div id=\"{{toolbar_id}}\" class=\"tool-container tool-{{toolbar_position}} toolbar-info-o\" style=\"position:absolute;width:auto;right:auto;opacity:0;\">\n" + // {{toolbar_animation}} opacity:0;left:0px;top:0px;
        "<div class=\"{{toolbar_btn_group}}\">\n" +
            "<button type=\"button\" ng-repeat=\"tool in tools track by $index\" href=\"#\" class=\"btn {{toolbar_size}} {{tool.style}}\" ng-click=\"click(tool.click)\"><i class=\"{{tool.icon}}\"></i></button>\n" + // 
        "</div>\n" +
        "<div class=\"arrow\" ng-class=\"{{arrow_top}}\"></div>\n" +
    "</div>\n" +
    "");
}]);

// angular.module("template/popover/popover-html.html", []).run(["$templateCache", function($templateCache) {
//   $templateCache.put("template/popover/popover-html.html",
//     "<div class=\"popover\"\n" +
//     "  tooltip-animation-class=\"fade\"\n" +
//     "  tooltip-classes\n" +
//     "  ng-class=\"{ in: isOpen() }\">\n" +
//     "  <div class=\"arrow\"></div>\n" +
//     "\n" +
//     "  <div class=\"popover-inner\">\n" +
//     "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
//     "      <div class=\"popover-content\" ng-bind-html=\"contentExp()\"></div>\n" +
//     "  </div>\n" +
//     "</div>\n" +
//     "");
// }]);