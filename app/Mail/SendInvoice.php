<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Invoice;
use Illuminate\Support\Facades\Storage;

class SendInvoice extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $invoice;
    public $fileName;
    public $msg;

    public function __construct(Invoice $invoice, $fileName, $msg)
    {

        $this->invoice = $invoice;
        $this->fileName = $fileName;
        $this->msg = $msg;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('invoice-mail')
            ->attach(Storage::disk('local')->path($this->fileName));
    }
}
