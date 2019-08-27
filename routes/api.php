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
    // Route::patch('/tab/{id}', 'TabController@update')->name('tab.update');
    Route::patch('/tab/{id}/{row}', 'TabController@update')->name('tab.update');
    Route::delete('/tab/{id}/{row}', 'TabController@destroyRow')->name('tab.delete');
});
