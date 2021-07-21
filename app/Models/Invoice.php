<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Invoice extends Eloquent
{
    protected $collection = 'invoices';
    protected $guarded = [];
    public const START_INVOICE_NUMBER = 100;

    public function setNumberAttribute()
    {
        $prevNum = Invoice::select('number')->latest('number')->first();

        $number = (!$prevNum) ? self::START_INVOICE_NUMBER : ((int) $prevNum->number + 1);

        $this->attributes['number'] = str_pad($number, 4, "0", STR_PAD_LEFT);

        return $this->attributes['number'];
    }

    public function client()
    {
        return $this->hasOne('App\Models\Client', '_id', 'client_id');
    }
}
