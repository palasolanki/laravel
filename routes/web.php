<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

use App\Invoice;

Route::get('/pdf', function () {
    $invoice = Invoice::first();
    return view('invoice.pdf', ['invoice' => $invoice, 'total'=>800, 'currency_sign'=>'$']);
});

Route::view('/{path?}', 'app')->where('path', '.*');
