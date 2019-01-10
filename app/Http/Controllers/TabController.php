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
        $tab = Tab::with('project.tabs')->findOrFail($tabId);
        return response()->json(['data' => $tab->project]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        $savedTab = $project->tabs()->create($request->all());
        return response()->json(['data' => $savedTab]);
    }

    public function destroy(Tab $tab): Response
    {
        $tab->delete();
        return response()->noContent();
    }
}
