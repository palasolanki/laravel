<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarkAsPaidRequest extends FormRequest
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
            'payment_receive_date'    => 'required',
            'inr_amount_received'      => 'required|numeric',
        ];
    }

    public function messages()
    {
        return [
            'payment_receive_date.required'   => 'Payment Receive Date is required',
            'inr_amount_received.required'   => 'INR Amount is required',
            'inr_amount_received.numeric'   => 'INR Amount is required'
        ];
    }

}
