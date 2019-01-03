<?php

namespace App\Http\Controllers;

use App\Project;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::get();
        return response()->json(['data' => $projects]);
    }
}
