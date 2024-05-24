<?php
namespace App\Traits;

use Spatie\Image\Image;

trait ImageManager
{
    public function base64FromRequest($realPath, $height = null, $width = null)
    {
        $image = Image::useImageDriver('gd')->loadFile($realPath);

        if ($height !== null) {
            $image->height($height);
        }

        if ($width !== null) {
            $image->width($width);
        }

        return $image->base64();
    }
}