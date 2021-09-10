<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Tag extends Eloquent
{
    protected $fillable = ['tag', 'type'];
    public const TYPE_EXPENSE = 'expense';
    public const TYPE_INCOME = 'income';
}
