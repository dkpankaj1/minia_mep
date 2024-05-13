<?php 
use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

Breadcrumbs::for('dashboard',function(BreadcrumbTrail $trail){
    $trail->push('Dashboard', route('dashboard'));
});

