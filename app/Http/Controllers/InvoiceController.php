<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use Pimlie\DataTables\MongodbDataTable;

class InvoiceController extends Controller
{

    public function index(): JsonResponse
    {
        $invoice = Invoice::with(['client' => function ($query) {
            $query->select('name');
        }]);

        return (new MongodbDataTable($invoice))
        ->make(true);
    }

    public function store(InvoiceRequest $request): JsonResponse
    {
        $inputs = $request->validated();
        $invoice =  Invoice::create($inputs);
        return response()->json(['invoice' => $invoice, 'message' => 'Invoice Save Successfully...']);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Invoice Remove Successfully...']);
    }

}
