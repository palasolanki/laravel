<?php

namespace App\Http\Controllers;

use App\Expense;
use Illuminate\Http\Request;
use App\Http\Requests\ExpenseRequest;
use Pimlie\DataTables\MongodbDataTable;
use App\Tag;
use File;
use DB;
use App\Traits\ChartData;
use Carbon\Carbon;
use Yajra\DataTables\DataTables;
use App\Exports\ExpenseExport;
use App\Imports\ExpenseImport;
use Maatwebsite\Excel\Facades\Excel as Excel;

class ExpenseController extends Controller
{
    use ChartData;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $from = ($request->daterange[0]) ? Carbon::parse($request->daterange[0]) : null;
        $to = ($request->daterange[1]) ? Carbon::parse($request->daterange[1]) : null;

        $selectedMediums = $request->mediums;
        $selectedTags = $request->tags;
        $expense = Expense::with('tags')
            ->when($from, function ($expense) use ($from, $to) {
                return $expense->whereBetween('date', [$from, $to]);
            })
            ->when($selectedMediums, function ($expense) use ($selectedMediums) {
                return $expense->whereIn('medium.id', $selectedMediums);
            })
            ->when($selectedTags, function ($expense) use ($selectedTags) {
                return $expense->whereIn('tag_ids', $selectedTags);
            });

        return (new MongodbDataTable($expense))
            ->addColumn('selectedDateForEdit', function ($expense) {
                return $expense->date;
            })
            ->make(true);
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

    public function getTagList()
    {
        $tags = Tag::where('type', 'expense')->get();
        return ['tags' => $tags];
    }

    public function monthlyExpenseChart(Request $request)
    {
        $chartData = $this->getChartData($request->chart_range, 'expense');
        return ['monthlyExpense' => $chartData[0], 'labels' => $chartData[1]];
    }

    public function deleteFileAttachment($deleteFile, $expenseId)
    {
        DB::collection('expenses')->where('_id', $expenseId)->pull('file_attachments', ['type' => Expense::FILE_TYPE_INVOICE, 'filename' => $deleteFile]);
        $fileName = storage_path('uploads/expense/' . $expenseId . '/' . $deleteFile);
        File::delete($fileName);
        return ['message' => 'File Delete Success!'];
    }

    public function exportExpense(Request $request)
    {
        return (new ExpenseExport($request))->download('expense.xlsx');
    }

    public function importExpense(Request $request)
    {
        $file = $request->file('expenseFile')->store('import');
        Excel::import(new ExpenseImport, $file);
        return;
    }
}
