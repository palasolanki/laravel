<?php

return [
    'expense' => [
        ['key' => 'id', 'name' => '#', 'width' => 50],
        ['key' => 'title', 'name' => 'Title', 'editable' => true],
        ['key' => 'paid_date', 'name' => 'Paid Date', 'editable' => true],
        ['key' => 'complete', 'name' => 'Complete', 'editable' => true],
        ['key' => 'paid_by', 'name' => 'Paid By', 'editable' => true],
        ['key' => 'medium', 'name' => 'Medium ', 'editable' => true],
        ['key' => 'comment', 'name' => 'Comment', 'editable' => true]
    ],
    'income' => [
        ['key' => 'id', 'name' => '#', 'width' => 50],
        ['key' => 'client_name', 'name' => 'Client', 'editable' => true],
        ['key' => 'paid_date', 'name' => 'Payment Date', 'editable' => true],
        ['key' => 'payment_received', 'name' => 'Amount', 'editable' => true],
        ['key' => 'medium', 'name' => 'Medium', 'editable' => true],
        ['key' => 'comment', 'name' => 'Comment', 'editable' => true]
    ]
];
