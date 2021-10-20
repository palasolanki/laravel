<?php

namespace App\Http\Requests;

use App\Client;
use App\Income;
use File;
use Illuminate\Foundation\Http\FormRequest;

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
        $stringOrFileRule = is_string($this->company_logo) ? 'string' : 'file';

        return [
            'name'              => 'required',
            'email'             => 'required|email',
            'company_name'      => 'required',
            'country_id'        => 'required',
            'payment_medium_id' => 'required',
            'company_logo'      => "sometimes|nullable|$stringOrFileRule",
            'address'           => 'nullable',
        ];
    }

    public function messages()
    {
        return [
            'name.required'                 => 'Name is required',
            'email.required'                => 'Email is required',
            'email.email'                   => 'Please enter valid email address',
            'company_name.required'         => 'Company Name is required',
            'country_id.required'           => 'Country is required',
            'payment_medium_id.required'    => 'Payment Medium is required',
        ];
    }

    public function save($id = null)
    {
        if (!$id) {
            $client = Client::create($this->all());
            $this->addFileAttachment($this->company_logo, $client);
            return $client;
        }
        $client                    = Client::find($id);
        $client->name              = $this->name;
        $client->email             = $this->email;
        $client->company_name      = $this->company_name;
        $client->country_id        = $this->country_id;
        $client->payment_medium_id = $this->payment_medium_id;
        $client->address           = $this->address;
        $client->save();
        $this->addFileAttachment($this->company_logo, $client);
        if ($client->wasChanged('name')) {
            Income::where('client.id', $id)->update(['client.name' => $client->name]);
        }
        return $client;
    }

    public function addFileAttachment($uploadedFile, $client)
    {
        if (!$this->hasFile('company_logo')) {
            return;
        }

        $logoDirPath = "app/public/clients/$client->_id/company_logo";

        if (File::exists(storage_path($logoDirPath))) {
            File::deleteDirectory(storage_path($logoDirPath));
        }
        File::makeDirectory(storage_path($logoDirPath), $mode = 0777, true, true);

        $fileName = time() . '.' . $uploadedFile->getClientOriginalExtension();
        $uploadedFile->move(storage_path($logoDirPath), $fileName);

        $client->company_logo = $fileName;
        $client->save();
    }
}
