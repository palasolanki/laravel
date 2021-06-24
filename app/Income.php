<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Income extends Eloquent
{
    protected $dates=['date'];
    protected $casts = [
        'date' => 'datetime:d-m-Y',
    ];
    protected $guarded = ['_id'];

    public function tags()
    {
        return $this->belongsToMany('App\Tag');
    }

    public function setAmountAttribute($value) 
    {
        $this->attributes['amount'] = (float)$value;
    }
}
