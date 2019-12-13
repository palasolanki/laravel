<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Income extends Eloquent
{
    protected $dates=['date'];
    protected $casts = [
        'date' => 'datetime:Y-m-d',
    ];
    // public function client() {
    //     return $this->hasOne('App\clients')
    // }
}
