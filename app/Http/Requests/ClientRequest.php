<?php

namespace App\Http\Requests;

use App\Income;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Client;

class ClientRequest extends FormRequest
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
            'name' => 'required',
            'company_name' => 'required',
            'country_id' => 'required'
        ];
    }

    public function save($id = null)
    {
        if (!$id) {
            return Client::create($this->all());
        }
        $client = Client::find($id);
        $client->name = $this->name;
        $client->company_name = $this->company_name;
        $client->country_id = $this->country_id;
        $client->save();

        if ($client->wasChanged('name')) {
            Income::where('client.id', $id)->update(['client.name' => $client->name]);
        }
        return $client;
    }
}
