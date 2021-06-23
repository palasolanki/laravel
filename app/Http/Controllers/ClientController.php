<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Models\Client;
use App\Http\Requests\ClientRequest;
use App\Income;
use Auth;
use File;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::with(['country' => function ($query) {
            $query->select('name');
        }])->get();
        return response()->json(['data' => $clients]);
    }

    public function store(ClientRequest $request): JsonResponse
    {
        $client = $request->save();
        return response()->json(['client' => $client, 'message' => 'Client added successfully.']);
    }

    public function show(Client $client): JsonResponse
    {
        return response()->json(['client' => $client]);
    }

    public function update(ClientRequest $request, $client): JsonResponse
    {
        $client = $request->save($client);
        return response()->json(['client' => $client, 'message' => 'Client updated successfully.']);
    }

    public function destroy(Client $client): JsonResponse
    {
        $incomes = Income::where('client_id', $client->_id)->get();
        if ($incomes->count() > 0) {
            $this->setClientIdNullForDeletedClient($incomes, $client->name);
        }
        Income::where('client.id', $client->_id)->unset('client');
        File::deleteDirectory(storage_path("app/clients/$client->_id"));
        $client->delete();
        return response()->json(['message' => 'Client deleted successfully.']);
    }

    public function getClients()
    {
        return ['clients' => Client::select('_id', 'name','address')->get()];
    }

    public function setClientIdNullForDeletedClient($incomes, $clientName)
    {
        foreach ($incomes as $income) {
            $income->client_id = null;
            $income->client_name = $clientName;
            $income->save();
        }
        return true;
    }
}
