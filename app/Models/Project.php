<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Project extends Eloquent
{
    protected $collection = 'projects';
    protected $guarded = [];

    /**
     * Get the tabs for the project.
     */
    public function tabs()
    {
        return $this->hasMany('App\Models\Tab');
    }

    /**
     * Get the oldest tab for the project.
     */
    public function first_tab()
    {
        return $this->hasOne('App\Models\Tab')->oldest();
    }
}
