<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'LoginController@login');

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', 'LoginController@logout');

    Route::apiResource('projects', 'ProjectController');

    Route::get('/tab/{id}', 'TabController@getTabData')->name('tab.getTabData');
    Route::post('/tab/{project}', 'TabController@store')->name('tab.store');
    Route::delete('/tab/{tab}', 'TabController@destroy')->name('tab.destroy');
    Route::patch('/tab/{id}', 'TabController@updateTab')->name('tab.updateTab');
    Route::post('/tab/{tab_id}/rows', 'TabController@update')->name('tab.update');
    Route::delete('/tab/{id}/{row}', 'TabController@destroyRow')->name('tab.delete');
    // Route::post('/tab/{id}', 'TabController@update')->name('tab.update');

    Route::get('/tags', 'TagController@index')->name('tag.index');
    Route::post('/tags', 'TagController@store')->name('tag.store');
    Route::patch('/tags/{id}', 'TagController@update')->name('tag.update');
    Route::delete('/tags/{id}', 'TagController@destroy')->name('tag.destroy');

    Route::resource('countries', 'CountryController');

    Route::resource('expenses', 'ExpenseController');
    Route::delete('expenses/file_attachment/{deleteFile}/{expenseId}', 'ExpenseController@deleteFileAttachment');

    Route::resource('incomes', 'IncomeController');

    Route::post('getIncomeData', 'IncomeController@index');
    Route::post('getExpenseData', 'ExpenseController@index');

    Route::resource('hardwares', 'HardwareController');

    Route::get('/get-expense-tags', 'ExpenseController@getTagList');
    Route::get('/get-income-tags', 'IncomeController@getTagList');

    Route::post('/monthlyExpenseChart', 'ExpenseController@monthlyExpenseChart');
    Route::post('/monthlyIncomeChart', 'IncomeController@monthlyIncomeChart');

    Route::get('/getClients', 'ClientController@getClients');

    Route::get('/getHardwareType', 'HardwareController@getHardwareType');

    Route::get('/clients', 'ClientController@index');
    Route::post('/clients/add', 'ClientController@store');
    Route::get('/client/{client}', 'ClientController@show');
    Route::post('/client/{client}', 'ClientController@update');
    Route::delete('/client/{client}', 'ClientController@destroy');

    Route::get('/mediums', 'MediumController@index');
    Route::post('/mediums', 'MediumController@store');
    Route::patch('/mediums/{id}', 'MediumController@update');
    Route::delete('/mediums/{id}', 'MediumController@destroy');

    Route::get('/get-expense-mediums', 'MediumController@getExpenseMediumList');
    Route::get('/get-income-mediums', 'MediumController@getIncomeMediumList');

    Route::post('/export/expense', 'ExpenseController@exportExpense');

    Route::post('/profile', 'ProfileController@update');

    Route::post('/invoices', 'InvoiceController@index');
    Route::post('/invoices/add', 'InvoiceController@store');
    Route::delete('/invoices/{invoice}', 'InvoiceController@destroy');
    Route::get('/invoices/next-invoice-number', 'InvoiceController@getNextInvoiceNumber');
    Route::post('/invoices/edit', 'InvoiceController@update');
    Route::post('/invoices/send/{invoice}', 'InvoiceController@sendInvoice');
    Route::post('/invoices/{invoice}/notes', 'InvoiceController@updateNotes');
    Route::post('/invoices/{invoice}/mark-paid', 'InvoiceController@markAsPaid');

    Route::get('/invoice/{invoiceId}', 'InvoiceController@edit');

    Route::post('/importExpense', 'ExpenseController@importExpense');
    Route::get('expense/download-sample', 'ExpenseController@downloadSample');
});
