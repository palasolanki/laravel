<?php

namespace App\Http\Requests;

use App\Income;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class IncomeRequest extends FormRequest
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
            'data.*.date' => 'required',
            'data.*.client_id' => 'required',
            'data.*.amount' => 'required|integer',
            'data.*.medium' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'data.*.date.required' => 'Date Field is required',
            'data.*.client_id.required' => 'Client Field is required',
            'data.*.amount.required' => 'Amount Field is required',
            'data.*.amount.integer' => 'Amount Field is Must Number',
            'data.*.medium.required' => 'Medium Field is required',
        ];
    }

    public function save($income = null) {
        foreach ($this->data as $value) {
            if(!$income) {
                $income = new Income;
            }
            $income->date = Carbon::parse($value['date']);
            $income->client_id = $value['client_id'];
            $income->amount = $value['amount'];
            $income->medium = $value['medium'];
            $income->save();
            $income = null;
        }
        return true;
    }
}
