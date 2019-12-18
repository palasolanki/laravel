<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeRequest;
use App\Income;
use Symfony\Component\HttpFoundation\Request;
use App\Traits\ChartData;
use Carbon\Carbon;
use Yajra\DataTables\DataTables;

class IncomeController extends Controller
{
    use ChartData;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $from = ($request->daterange[0]) ? $this->getDateObject($request->daterange[0])->startOfDay() : null;
        $to = ($request->daterange[1]) ? $this->getDateObject($request->daterange[1])->endOfDay() : null;

        $income = Income::with('clients')
                ->where(function($income) use ($from, $to)  {
                    if(isset($from)) {
                        $income->whereBetween('date', [$from, $to]);
                    }
                 })
                ->get();

        return Datatables::of($income)
            ->addColumn('mediumvalue', function ($income) {
                return config('expense.medium')[$income->medium];
            })
            ->addColumn('clientname', function ($income) {
                return  $income->clients->name;
            })->make(true);
    }

    public function getDateObject($string) {
        $date = trim(str_replace('(India Standard Time)', '', $string));
        return Carbon::parse($date);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(IncomeRequest $request)
    {
        $request->save();
        return ['message' => 'Add Success!'];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function show(Income $income)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function edit(Income $income)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function update(IncomeRequest $request, Income $income)
    {
        $request->save($income);
        return ['updateIncome' => $income, 'message' => 'Update Success!'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function destroy(Income $income)
    {
        $income->delete();
        return ['message' => 'Delete Success!'];
    }

    public function getIncomeMediumList() {
        return ['medium' => config('expense.medium')];
    }

    public function monthlyIncomeChart(Request $request) {
        $chartData = $this->getChartData($request->chart_range, 'income');
        return ['monthlyIncome' => $chartData[0], 'labels' => $chartData[1]];
    }
}
