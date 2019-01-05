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
        $saved = $project->tabs()->save($tab);

        $data = $project->toArray();
        $data['tab'] = $tab;

        return response()->json(['data' => $data]);
    }
}
