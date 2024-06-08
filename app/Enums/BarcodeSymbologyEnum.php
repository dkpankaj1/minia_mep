<?php

namespace App\Enums;

enum BarcodeSymbologyEnum: string
{
    case CODE_128 = 'C128';
    case CODE_39 = 'C39';
    case EAN_13 = 'EAN13';
    case UPC_A = 'UPCA';
    case CODE_93 = 'C93';
    case EAN_8 = 'EAN8';
    case QR_CODE = 'QRCODE';
    case PDF417 = 'PDF417';
    case DATAMATRIX = 'DATAMATRIX';

}
