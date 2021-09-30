<?php

namespace App\Http\Controllers;

use App\Http\Requests\TagRequest;
use App\Tag;

class TagController extends Controller
{
    public function index()
    {
        return Tag::all()->toJson();
    }

    public function store(TagRequest $request)
    {
        $tag = $request->save();
        return response()->json(['addedTag' => $tag, 'message' => 'Tag Add Successfully...']);
    }

    public function destroy($id)
    {
        Tag::findOrFail($id)->delete();
        return response()->json(['message' => 'Tag Delete Success!']);
    }

    public function update($id, TagRequest $request)
    {
        $tag = $request->save($id);
        return response()->json(['updatedTag' => $tag, 'message' => 'Tag Updated Successfully...']);
    }
}
