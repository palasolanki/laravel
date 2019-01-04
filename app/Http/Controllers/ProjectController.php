<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Tab;
use App\Http\Requests\ProjectRequest;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::get();
        return response()->json(['data' => $projects]);
    }

    public function store(ProjectRequest $request)
    {
        $project = Project::create([
            //'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        $tab = new Tab([
            'title' => 'New Tab'
        ]);
        $project->tabs()->save($tab);

        return response()->json(['data' => $project]);
    }
}
