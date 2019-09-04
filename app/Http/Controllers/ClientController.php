<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::get();
        return response()->json(['data' => $clients]);
    }

    public function store(Request $request)
    {
       dd($request);
    }


}
