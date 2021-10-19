<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
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
            'client_id'   => 'nullable',
            'number'      => 'nullable',
            'lines'       => 'required',
            'date'        => 'required',
            'due_date'    => 'required',
            'status'      => 'required',
            'amount_due'  => 'required',
            'amount_paid' => 'required',
            'notes'       => 'nullable',
            'bill_from'   => 'required',
            'bill_to'     => 'required',
            'currency'    => 'required'
        ];
    }
}
