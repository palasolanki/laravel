<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\Request;
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


        $pdf = PDF::loadView('invoice.pdf', ['invoice' => $invoice])->setPaper('a4', 'portrait');
        $fileName = 'invoice_' . $invoice->number . '.pdf';

        return $pdf->stream($fileName);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully.']);
    }
    public function getNextInvoiceNumber()
    {
        $invoice = new Invoice;
        $nextInvoiceNumber = $invoice->setNumberAttribute();
        return response()->json(['nextInvoiceNumber' => $nextInvoiceNumber]);
    }
    public function edit($invoiceId)
    {
        $invoice = Invoice::where('_id', $invoiceId)->get();
        return response()->json(['editInvoice' => $invoice]);
    }
    public function update(Request $request)
    {
        logger($request->all());
        $invoice = Invoice::where('_id', $request->_id)
            ->update([
                'client_id' => $request->client_id,
                'number' => $request->number,
                'lines' => $request->lines,
                'date' => $request->date,
                'due_date' => $request->due_date,
                'amount_due' => $request->amount_due,
                'amount_paid' => $request->amount_paid,
                'notes' => $request->notes,
                'bill_from' => $request->bill_from,
                'bill_to' => $request->bill_to,
            ]);
        return response()->json(['Data' => $invoice]);
    }
}
