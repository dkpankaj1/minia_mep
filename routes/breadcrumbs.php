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

//  =========== Expense :: Begin ============
Breadcrumbs::for('expense.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Expense', route('expense.index'));
});

Breadcrumbs::for('expense.create', function (BreadcrumbTrail $trail) {
    $trail->parent('expense.index');
    $trail->push('Create expense', route('expense.create'));
});

Breadcrumbs::for('expense.show', function (BreadcrumbTrail $trail, $expense) {
    $trail->parent('expense.index');
    $trail->push('Show expense', route('expense.show', $expense));
});

Breadcrumbs::for('expense.edit', function (BreadcrumbTrail $trail, $expense) {
    $trail->parent('expense.index');
    $trail->push('Edit expense', route('expense.edit', $expense));
});
//  =========== Expense :: End ============

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

Breadcrumbs::for('workstation.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Workstation', route('workstation.index'));
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


// ############## Production :: Begin ###############

//  =========== Bill of Material :: Begin ============
Breadcrumbs::for('production.bill-of-material.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('BillOfMaterial', route('production.bill-of-material.index'));
});
Breadcrumbs::for('production.bill-of-material.create', function (BreadcrumbTrail $trail) {
    $trail->parent('production.bill-of-material.index');
    $trail->push('Create BillOfMaterial', route('production.bill-of-material.create'));
});
Breadcrumbs::for('production.bill-of-material.show', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.bill-of-material.index');
    $trail->push('Show BillOfMaterial', route('production.bill-of-material.show', $i));
});
Breadcrumbs::for('production.bill-of-material.edit', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.bill-of-material.index');
    $trail->push('Edit BillOfMaterial', route('production.bill-of-material.edit', $i));
});
//  =========== Bill of Material :: End ============

//  =========== Production Order :: Begin ============
Breadcrumbs::for('production.production-order.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Production Order', route('production.production-order.index'));
});
Breadcrumbs::for('production.production-order.create', function (BreadcrumbTrail $trail) {
    $trail->parent('production.production-order.index');
    $trail->push('Create', route('production.production-order.create'));
});
Breadcrumbs::for('production.production-order.show', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.production-order.index');
    $trail->push('Show', route('production.production-order.show', $i));
});
Breadcrumbs::for('production.production-order.edit', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.production-order.index');
    $trail->push('Edit', route('production.production-order.edit', $i));
});
//  =========== Production Order :: End ============

//  =========== StockIssue :: Begin ============
Breadcrumbs::for('production.stock-issue.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Stock Issue', route('production.stock-issue.index'));
});
Breadcrumbs::for('production.stock-issue.create', function (BreadcrumbTrail $trail) {
    $trail->parent('production.stock-issue.index');
    $trail->push('Create', route('production.stock-issue.create'));
});
Breadcrumbs::for('production.stock-issue.show', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.stock-issue.index');
    $trail->push('Show', route('production.stock-issue.show', $i));
});
Breadcrumbs::for('production.stock-issue.edit', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.stock-issue.index');
    $trail->push('Edit', route('production.stock-issue.edit', $i));
});
//  =========== StockIssue :: End ============

//  =========== StockIssue :: Begin ============
Breadcrumbs::for('production.stock-received.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Stock Received', route('production.stock-received.index'));
});
Breadcrumbs::for('production.stock-received.create', function (BreadcrumbTrail $trail) {
    $trail->parent('production.stock-received.index');
    $trail->push('Create', route('production.stock-received.create'));
});
Breadcrumbs::for('production.stock-received.show', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.stock-received.index');
    $trail->push('Show', route('production.stock-received.show', $i));
});
Breadcrumbs::for('production.stock-received.edit', function (BreadcrumbTrail $trail, $i) {
    $trail->parent('production.stock-received.index');
    $trail->push('Edit', route('production.stock-received.edit', $i));
});
//  =========== StockIssue :: End ============


// ############## Production :: End ###############



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

//  =========== Sale :: Begin ============
Breadcrumbs::for('sale.index', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Sale', route('sale.index'));
});

Breadcrumbs::for('sale.create', function (BreadcrumbTrail $trail) {
    $trail->parent('sale.index');
    $trail->push('Create Sale', route('sale.create'));
});

Breadcrumbs::for('sale.show', function (BreadcrumbTrail $trail, $sale) {
    $trail->parent('sale.index');
    $trail->push('Show Sale', route('sale.show', $sale));
});

Breadcrumbs::for('sale.edit', function (BreadcrumbTrail $trail, $sale) {
    $trail->parent('sale.index');
    $trail->push('Edit Sale', route('sale.edit', $sale));
});
//  =========== Sale :: End ============

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


//  =========== Payment Purchase :: Begin ============
Breadcrumbs::for('purchase.payment.index', function (BreadcrumbTrail $trail) {
    $trail->parent('purchase.index');
    $trail->push('Payment', route('purchase.payment.index'));
});
Breadcrumbs::for('purchase.payment.create', function (BreadcrumbTrail $trail) {
    $trail->parent('purchase.payment.index');
    $trail->push('Create', route('purchase.payment.create'));
});
Breadcrumbs::for('purchase.payment.show', function (BreadcrumbTrail $trail, $r) {
    $trail->parent('purchase.payment.index');
    $trail->push('Show', route('purchase.payment.show', $r));
});
Breadcrumbs::for('purchase.payment.edit', function (BreadcrumbTrail $trail, $r) {
    $trail->parent('purchase.payment.index');
    $trail->push('Edit', route('purchase.payment.edit', $r));
});
//  =========== Payment Purchase :: End ============


//  =========== Payment Sale :: Begin ============
Breadcrumbs::for('sale.payment.index', function (BreadcrumbTrail $trail) {
    $trail->parent('sale.index');
    $trail->push('Payment', route('sale.payment.index'));
});
Breadcrumbs::for('sale.payment.create', function (BreadcrumbTrail $trail) {
    $trail->parent('sale.payment.index');
    $trail->push('Create', route('sale.payment.create'));
});
Breadcrumbs::for('sale.payment.show', function (BreadcrumbTrail $trail, $r) {
    $trail->parent('sale.payment.index');
    $trail->push('Show', route('sale.payment.show', $r));
});
Breadcrumbs::for('sale.payment.edit', function (BreadcrumbTrail $trail, $r) {
    $trail->parent('sale.payment.index');
    $trail->push('Edit', route('sale.payment.edit', $r));
});
//  =========== Payment Sale :: End ============



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

