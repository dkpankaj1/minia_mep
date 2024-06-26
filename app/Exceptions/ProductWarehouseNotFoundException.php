<?php

namespace App\Exceptions;

use Exception;

class ProductWarehouseNotFoundException extends Exception
{
    protected $message = 'Product or Warehouse not found';
}
