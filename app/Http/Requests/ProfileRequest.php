<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
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
        
        switch ($this->getMethod()) {
            case 'POST':
                return [
                    'name' => 'required|alpha_num',
                    'email' => 'required|email',
                    'password' => 'sometimes|required'
                ];
            default:
                return [

                ];
        }

    }
}
