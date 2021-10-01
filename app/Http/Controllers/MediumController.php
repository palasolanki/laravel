<?php

namespace App\Http\Controllers;

use App\Client;
use App\Expense;
use App\Http\Requests\MediumRequest;
use App\Income;
use App\Medium;

class MediumController extends Controller
{
    public function index()
    {
        return Medium::all()->toJson();
    }

    public function store(MediumRequest $request)
    {
        $medium = $request->save();
        return response()->json(['addedMedium' => $medium, 'message' => 'Medium Add Successfully...']);
    }

    public function destroy($id)
    {
        $medium = Medium::findOrFail($id);
        $model  = ['income' => new Income, 'expense' => new Expense];
        $model[$medium->type]::where('medium.id', $medium->_id)->unset('medium');
        Client::where('payment_medium_id', $medium->_id)->unset('payment_medium_id');
        $medium->delete();
        return response()->json(['message' => 'Medium Delete Success!']);
    }

    public function update($id, MediumRequest $request)
    {
        $medium = $request->save($id);
        return response()->json(['updatedMedium' => $medium, 'message' => 'Medium Updated Successfully...']);
    }

    public function getExpenseMediumList()
    {
        return response()->json(['medium' => Medium::select('_id', 'medium')->where('type', 'expense')->get()]);
    }

    public function getIncomeMediumList()
    {
        return response()->json(['medium' => Medium::select('_id', 'medium')->where('type', 'income')->get()]);
    }
}
