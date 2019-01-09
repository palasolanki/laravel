<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Tab;
use App\Http\Requests\ProjectRequest;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('first_tab')->get();
        return response()->json(['data' => $projects]);
    }

    public function store(ProjectRequest $request)
    {
        $project = Project::create($request->all());

        $tab = new Tab([
            'title' => 'New Tab'
        ]);
        $saved = $project->tabs()->save($tab);

        $data = $project->toArray();
        $data['first_tab'] = $tab;

        return response()->json(['data' => $data]);
    }

    public function update(ProjectRequest $request, Project $project)
    {
        $project->update($request->all());
        return response()->json(['data' => $project]);
    }
}
