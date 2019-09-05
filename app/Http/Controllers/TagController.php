<?php

namespace App\Http\Controllers;
use App\Http\Requests\TagRequest;
use App\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        return Tag::all()->toJson();  
    }

    public function store(TagRequest $request)
    {
        $tag = $request->save();
        return response()->json(['addedTag' => $tag]);
    }

    public function destroy($id)
    {
        Tag::findOrFail($id)->delete();
        return response()->json(['message' => 'Delete Success!']);
    }

    public function update($id, TagRequest $request){
        $tag = $request->save($id);
        return response()->json(['updatedTag' => $tag]);
    }
}
