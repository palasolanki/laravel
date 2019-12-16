<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Income extends Eloquent
{
    protected $dates=['date'];
    protected $casts = [
        'date' => 'datetime:Y-m-d',
    ];
    public function clients() {
        return $this->belongsTo('App\Models\Client', 'client');
    }
}
