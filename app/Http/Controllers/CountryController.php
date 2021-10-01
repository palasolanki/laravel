<?php

namespace App\Http\Controllers;

use App\Client;
use App\Country;
use App\Http\Requests\CountryRequest;

class CountryController extends Controller
{
    public function index()
    {
        $country = Country::all();
        return ['country' => $country];
    }

    public function store(CountryRequest $request)
    {
        $country = new Country;
        $request->save($country);
        return ['message' => 'Add Success!', 'country' => $country];
    }

    public function update(CountryRequest $request, Country $country)
    {
        $request->save($country);
        return ['updateCountry' => $country, 'message' => 'Update Success!'];
    }

    public function destroy(Country $country)
    {
        $country->delete();
        Client::where('country_id', $country->_id)->unset('country_id');
        return ['message' => 'Delete Success!'];
    }
}
