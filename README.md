inspired from paulkinzett.github.io/toolbar/

##This module can be used as element or attribute
<div toolbar></div>
<toolbar></toolbar>

##Attributes can be passed throught ng-model 
<toolbar ng-model="my_toolbar"></toolbar>
$scope.my_toolbar = {
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
}

or via attributes

<toolbar 
	ng-model="my_toolbar"
	icon="{{toolbox.icon}}" 
    size="{{toolbox.size}}" 
    bar-size="{{toolbox.bar_size}}" 
    position="{{toolbox.position}}" 
    style="{{toolbox.style}}" 
    animation="{{toolbox.animation}}" 
    event="{{toolbox.event}}" 
    bar-align="{{toolbox.bar_alignment}}" 
    adjustment="10" 
    tools="{{toolbox.tools}}"
>
	<toolbtn
		icon="fa fa-code-fork"
		style="btn-success"
		click="myFirstFunction({{var_chelou.yoyo}})"></toolbtn>
	<toolbtn
		icon="fa fa-code-fork"
		style="btn-danger"
		click="mySeconfFunction({{var_chelou.yoyo}})"></toolbtn>
</toolbar>
