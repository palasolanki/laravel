<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Invoice extends Eloquent
{
    protected $collection = 'invoices';
    protected $guarded = [];
    public const START_INVOICE_NUMBER = 100;

    public function setNumberAttribute()
    {
        $this->attributes['number'] = self::getNextInvoiceNumber();

        return $this->attributes['number'];
    }

    public static function getNextInvoiceNumber()
    {
        $prevNum = Invoice::select('number')->latest('number')->first();

        $number = (!$prevNum) ? self::START_INVOICE_NUMBER : ((int) $prevNum->number + 1);

        return str_pad($number, 4, "0", STR_PAD_LEFT);
    }

    public function client()
    {
        return $this->hasOne('App\Client', '_id', 'client_id');
    }
}
