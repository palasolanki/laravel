<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Medium extends Eloquent
{
    protected $collection = 'mediums';
    protected $fillable = ['medium', 'type'];
}
