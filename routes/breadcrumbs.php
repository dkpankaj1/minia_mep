<?php
use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail) {
    $trail->push('Dashboard', route('dashboard'));
});


//  =========== Masters :: End =============
Breadcrumbs::for('brand.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Brand', route('brand.index'));
});
Breadcrumbs::for('currency.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Currency', route('currency.index'));
});
Breadcrumbs::for('finance-year.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Finance Years', route('finance-year.index'));
});
Breadcrumbs::for('unit.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Unit', route('unit.index'));
});
Breadcrumbs::for('warehouse.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Warehouse', route('warehouse.index'));
});
//  =========== Masters :: End =============



//  =========== Role :: Begin============
Breadcrumbs::for('role.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Role', route('role.index'));
});
Breadcrumbs::for('role.create', function (BreadcrumbTrail $trail) {
    $trail->parent('role.index');
    $trail->push('Create Role', route('role.create'));
});
Breadcrumbs::for('role.show', function (BreadcrumbTrail $trail, $role) {
    $trail->parent('role.index');
    $trail->push('Show Role', route('role.show', $role));
});
Breadcrumbs::for('role.edit', function (BreadcrumbTrail $trail, $role) {
    $trail->parent('role.index');
    $trail->push('Edit Role', route('role.edit', $role));
});
//  =========== Role :: End =============


//  =========== User :: Begin============
Breadcrumbs::for('user.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('User', route('user.index'));
});
Breadcrumbs::for('user.create', function (BreadcrumbTrail $trail) {
    $trail->parent('user.index');
    $trail->push('Create User', route('user.create'));
});
Breadcrumbs::for('user.show', function (BreadcrumbTrail $trail, $user) {
    $trail->parent('user.index');
    $trail->push('Show User', route('user.show', $user));
});
Breadcrumbs::for('user.edit', function (BreadcrumbTrail $trail, $user) {
    $trail->parent('user.index');
    $trail->push('Edit User', route('user.edit', $user));
});
//  =========== User :: End =============

