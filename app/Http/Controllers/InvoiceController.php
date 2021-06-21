<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use Pimlie\DataTables\MongodbDataTable;
use PDF;

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

    public function store(InvoiceRequest $request)
    {
        $inputs = $request->validated();
        $invoice =  Invoice::create($inputs);
        return response()->json(['link' => route('invoice.download', $invoice->id)]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully.']);
    }

    public function generatePDF(Invoice $invoice)
    {
        $pdf = PDF::loadView('invoice.pdf', ['invoice' => $invoice])->setPaper('a4', 'portrait');
        $fileName = 'invoice_' . $invoice->number . '.pdf';
        return $pdf->stream($fileName);
    }
}
