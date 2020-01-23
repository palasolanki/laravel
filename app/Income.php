<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Income extends Eloquent
{
    protected $dates=['date'];
    protected $casts = [
        'date' => 'datetime:d-m-Y',
    ];
    public function clients() {
        return $this->hasOne('App\Models\Client', '_id', 'client_id');
    }
}
