<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

//  =========== Dashboard :: Begin ============
Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail) {
    $trail->push('Dashboard', route('dashboard'));
});
//  =========== Dashboard :: End ============

//  =========== Categories :: Begin ============
Breadcrumbs::for('category.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Category', route('category.index'));
});

Breadcrumbs::for('sub-category.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Sub Category', route('sub-category.index'));
});
//  =========== Categories :: End ============

//  =========== Customer :: Begin ============
Breadcrumbs::for('customer.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Customer', route('customer.index'));
});

Breadcrumbs::for('customer.create', function (BreadcrumbTrail $trail) {
    $trail->parent('customer.index');
    $trail->push('Create', route('customer.create'));
});

Breadcrumbs::for('customer.edit', function (BreadcrumbTrail $trail, $customer) {
    $trail->parent('customer.index');
    $trail->push('Edit', route('customer.edit', $customer));
});

Breadcrumbs::for('customer.show', function (BreadcrumbTrail $trail, $customer) {
    $trail->parent('customer.index');
    $trail->push('Show', route('customer.show', $customer));
});

Breadcrumbs::for('customer-group.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Customer Group', route('customer-group.index'));
});
//  =========== Customer :: End ============

//  =========== Masters :: Begin ============
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
//  =========== Masters :: End ============

//  =========== Products :: Begin ============
Breadcrumbs::for('product.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Product', route('product.index'));
});

Breadcrumbs::for('product.create', function (BreadcrumbTrail $trail) {
    $trail->parent('product.index');
    $trail->push('Create Product', route('product.create'));
});

Breadcrumbs::for('product.show', function (BreadcrumbTrail $trail, $product) {
    $trail->parent('product.index');
    $trail->push('Show Product', route('product.show', $product));
});

Breadcrumbs::for('product.edit', function (BreadcrumbTrail $trail, $product) {
    $trail->parent('product.index');
    $trail->push('Edit Product', route('product.edit', $product));
});
//  =========== Products :: End ============

//  =========== Purchase :: Begin ============
Breadcrumbs::for('purchase.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Purchase', route('purchase.index'));
});

Breadcrumbs::for('purchase.create', function (BreadcrumbTrail $trail) {
    $trail->parent('purchase.index');
    $trail->push('Create Purchase', route('purchase.create'));
});

Breadcrumbs::for('purchase.show', function (BreadcrumbTrail $trail, $purchase) {
    $trail->parent('purchase.index');
    $trail->push('Show Purchase', route('purchase.show', $purchase));
});

Breadcrumbs::for('purchase.edit', function (BreadcrumbTrail $trail, $purchase) {
    $trail->parent('purchase.index');
    $trail->push('Edit Purchase', route('purchase.edit', $purchase));
});
//  =========== Purchase :: End ============

//  =========== Role :: Begin ============
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
//  =========== Role :: End ============

//  =========== Settings :: Begin ============
Breadcrumbs::for('company.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Company Setting', route('company.index'));
});

Breadcrumbs::for('system.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('System Setting', route('system.index'));
});

Breadcrumbs::for('my-setting.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('My Setting', route('my-setting.index'));
});
//  =========== Settings :: End ============

//  =========== Supplier :: Begin ============
Breadcrumbs::for('supplier.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Supplier', route('supplier.index'));
});

Breadcrumbs::for('supplier.create', function (BreadcrumbTrail $trail) {
    $trail->parent('supplier.index');
    $trail->push('Create', route('supplier.create'));
});

Breadcrumbs::for('supplier.show', function (BreadcrumbTrail $trail, $supplier) {
    $trail->parent('supplier.index');
    $trail->push('Show', route('supplier.show', $supplier));
});

Breadcrumbs::for('supplier.edit', function (BreadcrumbTrail $trail, $supplier) {
    $trail->parent('supplier.index');
    $trail->push('Edit', route('supplier.edit', $supplier));
});
//  =========== Supplier :: End ============

//  =========== User :: Begin ============
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
//  =========== User :: End ============

