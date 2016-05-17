[Visit Demo on Github Pages](https://hugsbrugs.github.com/angular-toolbar)

![alt text](https://raw.githubusercontent.com/hugsbrugs/angular-toolbar/master/img/angular-toolbar.png "Angular Toolbar Example")

Build by [Hugo Maugey](https://hugo.maugey.fr "Webmaster Creation Site Web")

## Install



##This module can be used as element or attribute
```html
<div toolbar></div>
<toolbar></toolbar>
```

##Attributes can be passed throught ng-model

```html
<toolbar ng-model="my_toolbar"></toolbar>
```
```javascript
$scope.my_toolbar = {
	'bid' : 'example-1',
    'bstyle' : 'btn-danger',
    'event' : 'mouseover',
    'size' : 'btn-lg',
    'icon' : 'fa fa-times',
    'toolbar' : {
        'bid' : 'example-1',
        'position' : 'bottom',
        'animation' : 'animate-flip',
        'size' : 'btn-lg',
        'alignment' : 'normal',
        'adjustment' : 10,
        'tools' : [
            {icon : "fa fa-plus", bstyle : "btn-primary", click : "doSomething('tata 1')"},
            {icon : "fa fa-times", bstyle : "btn-danger", click : "doSomething('tata 2')"},
            {icon : "fa fa-times", bstyle : "btn-danger", click : "doSomething('{{var_chelou.yoyo}}')"},
        ]
    }
}
```

or via HTML data attributes


```html
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
```

or through a mix

```html
<toolbtn
    ng-model="mytoolbtn1">
</toolbtn>
<toolbar ng-model="mytoolbar1">
    <toolbarbtn ng-model="mytoolbarbtn1"></toolbarbtn>
    <toolbarbtn ng-model="mytoolbarbtn2"></toolbarbtn>
    <toolbarbtn ng-model="mytoolbarbtn3"></toolbarbtn>
</toolbar>
```
```javascript
scope.mytoolbtn1 = {
    'bid' : 'example-1',
    'bstyle' : 'btn-danger',
    'event' : 'mouseover',
    'size' : 'btn-lg',
    'icon' : 'fa fa-times',
};

$scope.mytoolbar1 = {
    'bid' : 'example-1',
    'position' : 'bottom',
    'animation' : 'animate-flip',
    'size' : 'btn-lg',
    'alignment' : 'normal',
    'adjustment' : 10,
    'tools' : []
};
$scope.mytoolbarbtn1 = {icon : "fa fa-plus", bstyle : "btn-primary", click : "doSomething('tata 1')"};
$scope.mytoolbarbtn2 = {icon : "fa fa-times", bstyle : "btn-danger", click : "doSomething('tata 2')"};
$scope.mytoolbarbtn3 = {icon : "fa fa-times", bstyle : "btn-warning", click : "doSomething('{{some_variable.some_property}}')"};
```

