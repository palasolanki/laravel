<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Token extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'access_token' => $this->resource,
            'token_type' => 'bearer',
        ];
    }
}
