<?php

return [
    'expense' => [
        ['key' => 'index', 'name' => '#', 'width' => 50],
        ['key' => 'title', 'name' => 'Title', 'editable' => true],
        ['key' => 'paid_date', 'name' => 'Paid Date', 'editable' => true],
        ['key' => 'complete', 'name' => 'Complete', 'editable' => true],
        ['key' => 'paid_by', 'name' => 'Paid By', 'editable' => true],
        ['key' => 'medium', 'name' => 'Medium ', 'editable' => true],
        ['key' => 'comment', 'name' => 'Comment', 'editable' => true]
    ],
    'income' => [
        ['key' => 'index', 'name' => '#', 'width' => 50],
        ['key' => 'client_id', 'name' => 'Client', 'editable' => true],
        ['key' => 'paid_date', 'name' => 'Payment Date', 'editable' => true],
        ['key' => 'payment_received', 'name' => 'Amount', 'editable' => true],
        ['key' => 'medium', 'name' => 'Medium', 'editable' => true],
        ['key' => 'comment', 'name' => 'Comment', 'editable' => true]
    ]
];
