<?php

namespace App\Http\Controllers;

use App\Expense;
use Illuminate\Http\Request;
use App\Http\Requests\ExpenseRequest;
use App\Tag;
use File;
use DB;
use App\Traits\ChartData;
use PHPUnit\Util\Json;

class ExpenseController extends Controller
{
    use ChartData;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Expense::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ExpenseRequest $request)
    {
        $request->save();
        return ['message' => 'Add Success!'];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function show(Expense $expense)
    {
        dd('show');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function update(ExpenseRequest $request, Expense $expense)
    {
        $request->save($expense);
        return ['updateExpense' => $expense, 'message' => 'Update Success!'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function destroy(Expense $expense)
    {
        File::deleteDirectory(storage_path('uploads/expense/' . $expense->_id));
        $expense->delete();
        return ['message' => 'Delete Success!'];
    }

    public function getExpenseMediumList() {
        return ['medium' => config('expense.medium')];
    }
    public function getTagList() {
        $tags = Tag::where('type', 'expense')->get()->pluck('tag');
        return ['tags' => $tags];
    }

    public function monthlyExpenseChart(Request $request) {
        $chartData = $this->getChartData($request->chart_range, 'expense');
        return ['monthlyExpense' => $chartData[0], 'labels' => $chartData[1]];
    }

    public function deleteFileAttachment($deleteFile, $expenseId)
    {
        DB::collection('expenses')->where('_id', $expenseId)->pull('file_attachments', ['type' => 'invoice', 'filename' => $deleteFile]);
        $fileName = storage_path('uploads/expense/' . $expenseId . '/'. $deleteFile);
        File::delete($fileName);
        return ['message' => 'File Delete Success!'];
    }
}
