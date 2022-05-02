<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Invoice;
use App\Mail\SendInvoice;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use PDF;
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

    public function store(InvoiceRequest $request)
    {
        $inputs   = $request->validated();
        $invoice  =  Invoice::create($inputs);
        $pdf      = PDF::loadView('invoice.pdf', ['invoice' => $invoice])->setPaper('a4', 'portrait');
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
        $nextInvoiceNumber = Invoice::getNextInvoiceNumber();
        return response()->json(['nextInvoiceNumber' => $nextInvoiceNumber]);
    }

    public function edit($invoiceId)
    {
        $invoice = Invoice::where('_id', $invoiceId)->get();
        return response()->json(['editInvoice' => $invoice]);
    }

    public function update(Request $request)
    {
        $invoice = Invoice::where('_id', $request->_id)
            ->update([
                'client_id'   => $request->client_id,
                'number'      => $request->number,
                'lines'       => $request->lines,
                'date'        => $request->date,
                'due_date'    => $request->due_date,
                'status'      => $request->status,
                'amount_due'  => $request->amount_due,
                'amount_paid' => $request->amount_paid,
                'notes'       => $request->notes,
                'bill_from'   => $request->bill_from,
                'bill_to'     => $request->bill_to,
                'currency'    => $request->currency,
                'total'       => $request->total,

            ]);

        $invoice           = Invoice::where('_id', $request->_id)->first();
        $pdf               = PDF::loadView('invoice.pdf', ['invoice' => $invoice])->setPaper('a4', 'portrait');
        $fileName          = 'invoice_' . $invoice->number . '.pdf';

        return $pdf->stream($fileName);
    }

    public function sendInvoice(Invoice $invoice, Request $request)
    {
        $pdf      = PDF::loadView('invoice.pdf', ['invoice' => $invoice])->setPaper('a4', 'portrait');
        $fileName = 'public/invoice/invoice_' . $invoice->number . '.pdf';
        Storage::put($fileName, $pdf->output());

        Mail::to($invoice->client->email)->send(new SendInvoice($invoice, $fileName, $request->message));
        $invoice = Invoice::where('_id', $invoice->_id)
            ->update([
                'last_sent_at' => Carbon::now()->toDateTimeString()
            ]);

        return;
    }

    public function updateNotes(Invoice $invoice, Request $request)
    {
        $invoice->notes = $request->note;
        $invoice->save();
        
        return response()->json(['message' => 'Note Updated Successfully...']);
        
    }

    public function updateStatus(Invoice $invoice)
    {
        $invoice->status = 'paid';
        $invoice->amount_paid = $invoice->amount_due;
        $invoice->save();
        return response()->json(['message' => 'Status Marked As Paid Successfully...']);
    }
}
