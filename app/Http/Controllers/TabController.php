<?php

namespace App\Http\Controllers;

use App\Models\Tab;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class TabController extends Controller
{
    public function getTabData(Request $request, $tabId): JsonResponse
    {
        $project = Tab::findOrFail($tabId)->project;

        $data = $project->toArray();
        $data['tabs'] = $project->tabs;

        return response()->json(['data' => $data]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        $savedTab = $project->tabs()->save(new Tab($request->all()));

        return response()->json(['data' => $savedTab]);
    }

    public function destroy(Tab $tab): Response
    {
        $tab->delete();
        return response()->noContent();
    }
}
