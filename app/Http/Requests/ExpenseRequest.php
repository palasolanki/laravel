<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Expense;

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
            'date' => 'required',
            'item' => 'required',
            'amount' => 'required|integer',
            'medium' => 'required',
        ];
    }

    public function save($expense = null) {
        if (!$expense) {
            $expense = new Expense;
        }
        $expense->date = $this->date;
        $expense->item = $this->item;
        $expense->amount = $this->amount;
        $expense->medium = $this->medium;
        $expense->save();
        return $expense;
    }
}
