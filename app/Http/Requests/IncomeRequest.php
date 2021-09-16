<?php

namespace App\Http\Requests;

use App\Client;
use App\Income;
use App\Medium;
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
            'data.*.date'      => 'required',
            'data.*.amount'    => 'required|integer',
            'data.*.medium'    => 'required',
            'data.*.client_id' => 'required',
            'data.*.tags'      => 'required',
        ];
    }

    public function messages()
    {
        return [
            'data.*.date.required'      => 'Date is required',
            'data.*.amount.required'    => 'Amount is required',
            'data.*.amount.integer'     => 'Amount must be a number',
            'data.*.medium.required'    => 'Medium is required',
            'data.*.client_id.required' => 'Client is required',
            'data.*.tags.required'      => 'Tags is required',
        ];
    }

    public function save($income = null)
    {
        foreach ($this->data as $value) {
            if (!$income) {
                $income = new Income;
            }
            if ($value['client_id']) {
                $client         = Client::find($value['client_id']);
                $income->client = ['id' => $client->_id, 'name' => $client->name];
            }
            $medium         = Medium::find($value['medium']);
            $income->date   = Carbon::parse($value['date']);
            $income->amount = $value['amount'];
            $income->medium = ['id' => $medium->_id, 'medium' => $medium->medium];
            $income->notes  = $value['notes'];
            $income->save();
            $this->saveIncomeTags($income, $value);
            $income = null;
        }
        return true;
    }

    public function saveIncomeTags($income, $value)
    {
        if (array_key_exists('tagsArray', $value)) {
            $income->wasRecentlyCreated
                ? $income->tags()->attach($value['tagsArray'])
                : $income->tags()->sync($value['tagsArray']);
        }
    }
}
