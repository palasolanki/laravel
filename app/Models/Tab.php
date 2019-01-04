<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Tab extends Eloquent
{
    protected $collection = 'tabs';
    protected $guarded = [];
}
