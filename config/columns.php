<?php

return [
    'expense' => [
        ['key' => 'id', 'name' => 'ID', 'width' => 50],
        ['key' => 'title', 'name' => 'Title', 'editable' => true],
        ['key' => 'paid_date', 'name' => 'Paid Date', 'editable' => true],
        ['key' => 'complete', 'name' => 'Complete', 'editable' => true],
        ['key' => 'paid_by', 'name' => 'Paid By', 'editable' => true],
        ['key' => 'medium', 'name' => 'Medium', 'editable' => true],
        ['key' => 'comment', 'name' => 'Comment', 'editable' => true]
    ],
    'income' => [
        ['key' => 'id', 'name' => 'ID', 'width' => 50],
        ['key' => 'client_name', 'name' => 'Client Name', 'editable' => true],
        ['key' => 'paid_date', 'name' => 'Paid Date', 'editable' => true],
        ['key' => 'payment_received', 'name' => 'Payment Received', 'editable' => true],
        ['key' => 'medium', 'name' => 'Medium', 'editable' => true],
        ['key' => 'comment', 'name' => 'Comment', 'editable' => true]
    ]
];
