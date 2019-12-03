<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Expense extends Eloquent
{
    protected $dates=['date'];
    protected $casts = [
        'date' => 'datetime:Y-m-d',
    ];
}
