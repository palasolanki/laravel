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
            'data.*.client' => 'required',
            'data.*.amount' => 'required|integer',
            'data.*.medium' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'data.*.date.required' => 'Date Filed is required',
            'data.*.client.required' => 'Client Filed is required',
            'data.*.amount.required' => 'Amount Filed is required',
            'data.*.amount.integer' => 'Amount Filed is Must Number',
            'data.*.medium.required' => 'Medium Filed is required',
        ];
    }

    public function save($income = null) {
        foreach ($this->data as $value) {
            if(!$income) {
                $income = new Income;
            }
            $income->date = Carbon::parse($value['date']);
            $income->client = $value['client'];
            $income->amount = $value['amount'];
            $income->medium = $value['medium'];
            $income->save();
            $income = null;
        }
        return true;
    }
}
