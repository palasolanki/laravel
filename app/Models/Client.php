<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Client extends Eloquent
{
    protected $collection = 'clients';
    protected $fillable = ['name', 'company_name', 'country_id','company_logo','address'];

    public function country() {
        return $this->hasOne('App\Country', '_id','country_id');
    }
}
