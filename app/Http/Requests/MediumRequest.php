<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Medium;
class MediumRequest extends FormRequest
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
            'medium' => 'required',
            'type' => 'required'
        ];
    }

    public function save($id = null)
    {
        if ($id) {
            $medium = Medium::where('_id', $id)->first();
        } else {
            $medium = new Medium;
        }
        
        $medium->medium = $this->medium;
        $medium->type = $this->type;
        $medium->save();

        return $medium;
    }
}
