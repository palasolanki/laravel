<?php

namespace App\Http\Requests;

use App\Income;
use File;
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
            'country_id' => 'required',
            'company_logo' => 'nullable',
            'address' => 'nullable',
        ];
    }

    public function save($id = null)
    {
        if (!$id) {
            $client = Client::create($this->all());
            $this->addFileAttachment($this->company_logo, $client);
            return $client;
        }
        $client = Client::find($id);
        $client->name = $this->name;
        $client->company_name = $this->company_name;
        $client->country_id = $this->country_id;
        $client->address = $this->address;
        $client->save();
        $this->addFileAttachment($this->company_logo, $client);
        if ($client->wasChanged('name')) {
            Income::where('client.id', $id)->update(['client.name' => $client->name]);
        }
        return $client;
    }

    public function addFileAttachment($uploadedFile, $client)
    { 
        if(!$uploadedFile) {
            $client->company_logo = $uploadedFile;
            $client->save();
            return;
        }
        if (File::exists(storage_path('clients/company_logo/' . $client->_id))) {
            File::deleteDirectory(storage_path('clients/company_logo/' . $client->_id));
        }
        File::makeDirectory(storage_path('clients/company_logo/' . $client->_id), $mode = 0777, true, true);
        $file = $uploadedFile->getClientOriginalName();
        $originalFileName = pathinfo($file, PATHINFO_FILENAME);
        $fileName = $originalFileName . '-' . time() . '.' . $uploadedFile->getClientOriginalExtension();
        $uploadedFile->move(storage_path('clients/company_logo/' . $client->_id), $fileName);

        $client->company_logo = $fileName;
        $client->save();
    }
}
