<?php

return [
    'hardware_type' => [
        'mouse'    => 'Mouse',
        'keyboard' => 'Keyboard',
        'cpu'      => 'CPU',
        'monitor'  => 'Monitor',
    ],
    'start_invoice_number' => env('START_INVOICE_NUMBER', 100),
    'currencies' => [
        'USD' => '$',
        'EUR' => '€',
        'INR' => '₹',
        'NZD' => '$',
        'CAD' => '$',
    ],
    'gst' => [
        'SAC_code' => 998314,
        'IGST' => 18,
        'SGST' => 9,
        'CGST' => 9,
    ]
];
