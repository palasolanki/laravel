<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Invoice extends Eloquent
{
    protected $collection = 'invoices';
    protected $guarded = [];

    public function setNumberAttribute()
    {
            $prevNum = Invoice::select('number')->latest()->first();
            if(!$prevNum){
                $this->attributes['number'] = 1;
                return;
            }
            $this->attributes['number'] = (int) $prevNum->number + 1;
    }

    public function client() {
        return $this->hasOne('App\Models\Client', '_id','client_id');
    }
}
