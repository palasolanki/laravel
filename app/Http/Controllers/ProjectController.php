<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Tab;
use App\Http\Requests\ProjectRequest;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with('first_tab')->get();
        return response()->json(['data' => $projects]);
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $data = $request->all();
        $type = $request->get('type');
        $data['columns'] = config("columns.{$type}", []);
        $project = Project::create($data);

        $tab = ['title' => 'New Tab'];
        $tab['rows'] = [];

        $saved = $project->tabs()->create($tab);

        $data = $project->toArray();
        $data['first_tab'] = $saved;

        return response()->json(['data' => $data]);
    }

    public function update(ProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->all());
        return response()->json(['data' => $project]);
    }
}
