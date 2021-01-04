<?php

namespace App\Http\Requests;

use App\Income;
use App\Models\Client;
use App\Models\Medium;
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
                $updateIncome = false;
            } else {
                $updateIncome = true;
            }
            $client = Client::find($value['client_id']);
            $medium = Medium::find($value['medium']);
            $income->date = Carbon::parse($value['date']);
            $income->client = ['id' => $client->_id, 'name' => $client->name];
            $income->amount = $value['amount'];
            $income->medium = ['id' => $medium->_id, 'medium' => $medium->medium];
            $income->notes = $value['notes'];
            $income->save();
            $this->saveIncomeTags($income, $value, $updateIncome);
            $income = null;
        }
        return true;
    }

    public function saveIncomeTags($income, $value, $updateIncome) {
        if (array_key_exists('tagsArray', $value)) {
            $updateIncome 
                ? $income->tags()->sync($value['tagsArray']) 
                : $income->tags()->attach($value['tagsArray']);
        }
    }
}
