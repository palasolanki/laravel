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
        $from = ($request->daterange[0]) ? Carbon::parse($request->daterange[0]) : null;
        $to = ($request->daterange[1]) ? Carbon::parse($request->daterange[1]) : null;

        $selectedClient = $request->client;
        $income = Income::with('clients')
                ->when($from, function ($income) use ($from, $to) {
                    return $income->whereBetween('date', [$from, $to]);
                })
                ->when($selectedClient != "all", function ($income) use ($selectedClient) {
                    return $income->where('client', $selectedClient);
                })
                ->get();

        return Datatables::of($income)
            ->addColumn('selectedDateForEdit', function ($income) {
                return $income->date;
            })
            ->addColumn('mediumvalue', function ($income) {
                return config('expense.medium')[$income->medium];
            })
            ->addColumn('clientname', function ($income) {
                return  $income->clients->name;
            })->make(true);
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
