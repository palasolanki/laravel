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

use Illuminate\Http\Resources\Json\Resource;

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
    Route::resource('expenses', 'ExpenseController');
    Route::resource('incomes', 'IncomeController');
    Route::resource('hardwares', 'HardwareController');
    Route::get('/getTagList', 'ExpenseController@getTagList');
    Route::get('/getExpenseMediumList', 'ExpenseController@getExpenseMediumList');
    Route::get('/getIncomeMediumList', 'IncomeController@getIncomeMediumList');
    Route::post('/monthlyExpenseChart', 'ExpenseController@monthlyExpenseChart');
    Route::post('/monthlyIncomeChart', 'IncomeController@monthlyIncomeChart');
    Route::get('/getClients', 'ClientController@getClients');
    Route::get('/getHardwareType', 'HardwareController@getHardwareType');
    Route::get('/clients', 'ClientController@index');
    Route::post('/addClient', 'ClientController@store');
    Route::get('/client/{client}', 'ClientController@show');
    Route::patch('/client/{client}', 'ClientController@update');
    Route::delete('/client/{client}', 'ClientController@destroy');
});
