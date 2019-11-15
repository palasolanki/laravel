<?php

namespace App\Http\Controllers;

use App\Expense;
use Illuminate\Http\Request;
use App\Http\Requests\ExpenseRequest;
use Illuminate\Support\Carbon;

class ExpenseController extends Controller
{
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
        $expense->delete();
        return ['message' => 'Delete Success!'];
    }

    public function getMedium() {
        return ['medium' => config('expense.medium')];
    }

    public function monthlyExpenseChart(Request $request) {
        $today = Carbon::now();
        $current_date = $today->day;
        $current_month = $today->month;
        $current_year = $today->year;

        if($request->chart_range == 'current_year') {

            $querydate = $this->getCurrentYearQuerydate($current_month, $current_year, $current_date);

        } elseif ($request->chart_range == 'past_year') {

            $querydate = $this->getPastYearQuerydate($current_month, $current_year);

        } else {
            $querydate = [
                Carbon::createFromDate($current_year-1, $current_month+1, 1)->startOfMonth(),
                Carbon::createFromDate($current_year, $current_month, 1)->endOfMonth()
            ];
        }
        $monthData = $this->getMonthData($querydate);
        $monthData = ($request->chart_range != 'current_year') ? $monthData : $this->getMonthDataForCurrentYear($monthData, $current_month);
        $monthData = ($request->chart_range != 'last_12_month') ? $monthData : $this->getMonthDataForLastYear($monthData, $querydate);

        return ['monthlyExpense' => array_values($monthData)];
    }

    public function getCurrentYearQuerydate($current_month, $current_year, $current_date) {
        $starYear = (in_array($current_month, [1,2,3])) ? $current_year - 1 : $current_year;

        $querydate = [
            Carbon::createFromDate($starYear, 4, 1)->startOfMonth(),
            Carbon::createFromDate($current_year, $current_month, $current_date)->endOfDay()
        ];
        return $querydate;
    }

    public function getPastYearQuerydate($current_month, $current_year) {
        $startPastYear = (in_array($current_month, [1,2,3])) ? $current_year-2 : $current_year-1;
        $endPastYear = (in_array($current_month, [1,2,3])) ? $current_year-1 : $current_year;
        $querydate = [
            Carbon::createFromDate($startPastYear, 4, 1)->startOfMonth(),
            Carbon::createFromDate($endPastYear, 3, 31)->endOfMonth()
        ];
        return $querydate;
    }

    public function getMonthData($querydate) {
        $monthData = ['4' => 0, '5' => 0, '6' => 0, '7' => 0, '8' => 0, '9' => 0, '10' => 0, '11' => 0, '12' => 0, '1' => 0, '2' => 0, '3' => 0];
        $data = Expense::whereBetween('created_at', $querydate )->get();

        foreach ($data as $key => $value) {
            $date = Carbon::parse($value->date['date']);
            $month = $date->month;

            if (in_array($month, array_keys($monthData))) {
                $monthData[$month] = $monthData[$month] + $value->amount;
            }
        }
        return $monthData;
    }

    public function getMonthDataForCurrentYear($monthData, $current_month) {
        $finalMonth = [];
        foreach ($monthData as $key => $value) {
            $finalMonth[$key] = $value;
            if ($key == $current_month) {
                break;
            }
        }
        return $finalMonth;
    }

    public function getMonthDataForLastYear($monthData, $querydate) {
        foreach ($monthData as $key => $value) {
            if($key == $querydate[0]->month) {
                break;
            }
            array_push($monthData, $value);
            unset($monthData[$key]);
        }
        return $monthData;
    }
}
