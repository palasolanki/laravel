<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Expense extends Eloquent
{
    protected $dates=['date'];
    protected $casts = [
        'date' => 'datetime:d-m-Y',
    ];
    const FILE_TYPE_INVOICE = 'invoice';
}
