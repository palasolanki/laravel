<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Client;

class ClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'company_name' => 'required',
            'country' => 'required'
        ];
    }

    public function save($id = null)
    {
        if (!$id) {
            return Client::create($this->all());
        }
        
        return Client::where('_id', $id)
            ->update($this->all());
    }
}
