<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Models\Client;
use App\Http\Requests\ClientRequest;
use Auth;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::get();
        return response()->json(['data' => $clients]);
    }

    public function store(ClientRequest $request): JsonResponse
    {
       $client = $request->save();
       return response()->json(['client' => $client, 'message' => 'Client Added Successfully...']);
    }

    public function show(Client $client): JsonResponse
    {
       return response()->json(['client' => $client]);
    }

    public function update(ClientRequest $request, $client): JsonResponse
    {
        $client = $request->save($client);
        return response()->json(['client' => $client, 'message' => 'Client Updated Successfully...']);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();
        return response()->json(['message' => 'Client deleted Successfully...']);
    }

}
