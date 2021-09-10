<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Client extends Eloquent
{
    protected $collection = 'clients';
    protected $fillable = ['name', 'company_name', 'country_id', 'payment_medium_id', 'company_logo', 'address', 'email'];
    protected $appends = ['company_logo_url'];

    public function country()
    {
        return $this->hasOne('App\Country', '_id', 'country_id');
    }

    public function medium()
    {
        return $this->hasOne('App\Medium', '_id', 'payment_medium_id');
    }

    public function getCompanyLogoUrlAttribute()
    {
        return url("storage/clients/$this->_id/company_logo/" . $this->company_logo);
    }
}
