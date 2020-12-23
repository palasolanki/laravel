<?php

namespace App\Http\Controllers;
use App\Http\Requests\MediumRequest;
use App\Models\Medium;
use Illuminate\Http\Request;

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
        Medium::findOrFail($id)->delete();
        return response()->json(['message' => 'Medium Delete Success!']);
    }

    public function update($id, MediumRequest $request){
        $medium = $request->save($id);
        return response()->json(['updatedMedium' => $medium, 'message' => 'Medium Updated Successfully...']);
    }

    public function getExpenseMediumList() {
        return response()->json(['medium' => Medium::select('_id', 'medium')->where('type', 'expense')->get()]);
    }

    public function getIncomeMediumList() {
        return response()->json(['medium' => Medium::select('_id', 'medium')->where('type', 'income')->get()]);
    }
}
