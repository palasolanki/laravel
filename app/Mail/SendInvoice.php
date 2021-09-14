<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Invoice;
use Illuminate\Support\Facades\Storage;

class SendInvoice extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(Invoice $invoice, $fileName, $message)
    {
        $this->invoice = $invoice;
        $this->fileName = $fileName;
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.invoice')
            ->attach(Storage::disk('local')->path($this->fileName));
    }
}
