<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Expense;
use Illuminate\Support\Carbon;

class ExpenseRequest extends FormRequest
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
            'data.*.item' => 'required',
            'data.*.amount' => 'required|integer',
            'data.*.medium' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'data.*.date.required' => 'Date Field is required',
            'data.*.item.required' => 'Item Field is required',
            'data.*.amount.required' => 'Amount Field is required',
            'data.*.amount.integer' => 'Amount Field is Must Number',
            'data.*.medium.required' => 'Medium Field is required',
        ];
    }

    public function save($expense = null) {
        foreach ($this->data as $value) {
            if(!$expense) {
                $expense = new Expense;
            }
            $expense->date = Carbon::parse($value['date']);
            $expense->item = $value['item'];
            $expense->amount = $value['amount'];
            $expense->medium = $value['medium'];
            $expense->tags = $value['tagsArray'];
            $expense->save();
            $expense = null;
        }
        return true;
    }
}
