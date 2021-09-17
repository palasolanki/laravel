<?php

namespace App\Http\Requests;

use App\Hardware;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class HardwareRequest extends FormRequest
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
            'data.*.item'   => 'required',
            'data.*.type'   => 'required',
            'data.*.status' => 'required',
            'data.*.notes'  => 'required',
        ];
    }

    public function messages()
    {
        return [
            'data.*.item.required'   => 'Item is required',
            'data.*.type.required'   => 'Type is required',
            'data.*.status.required' => 'Status is required',
            'data.*.notes.required'  => 'Notes is required',
        ];
    }

    public function save($hardware = null)
    {
        foreach ($this->data as $value) {
            if (!$hardware) {
                $hardware = new Hardware;
            }
            $hardware->date          = ($value['date']) ? Carbon::createFromFormat('d/m/Y', $value['date'])->startOfDay() : null;
            $hardware->item          = $value['item'];
            $hardware->type          = $value['type'];
            $hardware->serial_number = $value['serial_number'];
            $hardware->status        = $value['status'];
            $hardware->notes         = $value['notes'];
            $hardware->save();
            $hardware = null;
        }
        return true;
    }
}
