<?php

namespace App\Http\Controllers;

use App\Models\Tab;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use MongoDB\BSON\ObjectId;
use App\Models\Client;
use Carbon\Carbon;

class TabController extends Controller
{
    public function getTabData(Request $request, $tabId): JsonResponse
    {
        $tab = Tab::with('project.tabs')->findOrFail($tabId)->toArray();
        foreach ($tab['rows'] as $key => $val) {
            if (!$val['client_id']) continue;
            $client_name = Client::select('name')->where('_id', $val['client_id'])->first();
            $tab['rows'][$key]['client_id'] = $client_name->name;
        }
        return response()->json(['data' => $tab['project'], 'rows' => isset($tab['rows']) ? $tab['rows'] : []]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        $data = [
            "title" => $request->get('title'),
            "month" => Carbon::parse($request->get('month'))->month,
            "year" => $request->get('year'),
        ];
        $savedTab = $project->tabs()->create($data);
        return response()->json(['data' => $savedTab]);
    }

    public function destroy(Tab $tab): Response
    {
        $tab->delete();
        return response()->noContent();
    }

    public function updateTab(Request $request, $tabId): JsonResponse
    {
        $tab = Tab::findOrFail($tabId);
        $data = [
            "title" => $request->get('title'),
            "month" => Carbon::parse($request->get('month'))->month,
            "year" => $request->get('year'),
        ];
        $tab->update($data);
        return response()->json(['data' => $tab->project, 'rows' => isset($tab->rows) ? $tab->rows : []]);
    }

    public function update(Request $request): JsonResponse
    {
        $tabId = $request->tab_id;
        $tab = Tab::findOrFail($tabId);
        $rowDataArray = $request->except(['index', 'id']);
        $rowId = $request->id;

        if ($rowId) {
            $rowKey = $this->findRowKey($tab, $rowId);
            $rowDataArray['id'] = $request->get('id');
            $tab->{"rows.$rowKey"} = $rowDataArray;
            $tab->save();
        } else {
            $rowDataArray['id'] = $this->getNewObjectId();
            $tab->push("rows", [$rowDataArray]);
        }

        $tabData = [];

        foreach ($tab->rows as $key => $row) {
            $tabData['row'][$key]['client_id'] = $row['client_name'] ?? $row['text'];
            $tabData['row'][$key]['text'] = $row['client_name'] ?? $row['text'];
            $tabData['row'][$key]['value'] = $row['client_id'] ?? $row['value'];
            $tabData['row'][$key]['id'] = $row['id'];
        }

        return response()->json(['data' => $tab->project, 'rows' => isset($tab->rows) ? $tabData['row'] : []]);
    }

    public function findRowKey($tab, $rowId)
    {
        foreach ($tab->rows as $rowKey => $rowValue) {
            if($rowId == $rowValue['id']){
                return $rowKey;
            }
        }
    }

    protected function getNewObjectId()
    {
        return (new ObjectId)->__toString();
    }

    public function destroyRow($tabId, $rowId)
    {
        $tab = Tab::findOrFail($tabId);
        $tab->pull("rows", ['id' => $rowId]);

        return response()->json(['data' => $tab->project, 'rows' => isset($tab->rows) ? $tab->rows : []]);
    }
}
