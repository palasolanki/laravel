<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;

class InvoiceController extends Controller
{

    public function store(InvoiceRequest $request): JsonResponse
    {
        $inputs = $request->validated();
        $invoice =  Invoice::create($inputs);;
        return response()->json(['invoice' => $invoice, 'message' => 'Invoice Save Successfully...']);
    }

}
