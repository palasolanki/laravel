<?php

namespace App\Http\Controllers;

use App\Models\Tab;
use Illuminate\Http\Request;

class TabController extends Controller
{
    public function getTabData(Request $request, $tabId)
    {
        $project = Tab::findOrFail($tabId)->project;

        $data = $project->toArray();
        $data['tabs'] = $project->tabs;

        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
    }
}
