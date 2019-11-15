<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeRequest;
use App\Income;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Request;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Income::all();
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

    public function monthlyIncomeChart(Request $request) {
        $today = Carbon::now();
        $current_date = $today->day;
        $current_month = $today->month;
        $current_month_name = substr($today->format('F'), 0, 3);
        $current_year = $today->year;
        $monthName = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        $labels = [];

        if($request->chart_range == 'current_year') {

            $querydate = $this->getCurrentYearQuerydate($current_month, $current_year, $current_date);
            $labels = $this->getCurrentYearLablesName($current_month, $monthName, $current_year, $current_month_name);

        } elseif ($request->chart_range == 'past_year') {

            $querydate = $this->getPastYearQuerydate($current_month, $current_year);
            $labels = $this->getPastYearLablesName($current_month, $current_year, $monthName);

        } else {
            $querydate = [
                Carbon::createFromDate($current_year-1, $current_month+1, 1)->startOfMonth(),
                Carbon::createFromDate($current_year, $current_month, 1)->endOfMonth()
            ];
            $labels = $this->getLastYearLablesName($querydate, $monthName);
        }

        $monthData = $this->getMonthData($querydate);

        $monthData = ($request->chart_range != 'current_year') ? $monthData : $this->getMonthDataForCurrentYear($monthData, $current_month);
        $monthData = ($request->chart_range != 'last_12_month') ? $monthData : $this->getMonthDataForLastYear($monthData, $querydate);

        return ['monthlyIncome' => array_values($monthData), 'labels' => $labels];
    }

    public function getCurrentYearQuerydate($current_month, $current_year, $current_date) {
        $starYear = (in_array($current_month, [1,2,3])) ? $current_year - 1 : $current_year;

        $querydate = [
            Carbon::createFromDate($starYear, 4, 1)->startOfMonth(),
            Carbon::createFromDate($current_year, $current_month, $current_date)->endOfDay()
        ];
        return $querydate;
    }

    public function getCurrentYearLablesName($current_month, $monthName, $current_year, $current_month_name) {
        $currentLableYearForStart = (in_array($current_month, [1,2,3])) ? substr($current_year-1, 2) : substr($current_year, 2);
        $currentLableYearForEnd = (in_array($current_month, [1,2,3])) ? substr($current_year, 2) : substr($current_year + 1, 2);

        return $this->getLablesNameForChart($monthName, $currentLableYearForStart, $currentLableYearForEnd, $current_month_name);
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

    public function getPastYearLablesName($current_month, $current_year, $monthName) {
        $pastLableYearForStart = (in_array($current_month, [1,2,3])) ? substr($current_year-2, 2) : substr($current_year-1, 2);
        $pastLableYearForEnd = (in_array($current_month, [1,2,3])) ? substr($current_year-1, 2) : substr($current_year, 2);

        return $this->getLablesNameForChart($monthName, $pastLableYearForStart, $pastLableYearForEnd);
    }

    public function getLastYearLablesName($querydate, $monthName) {
        $lastYearLablesName = [];
        $oldYear = substr($querydate[0]->year, 2);
        $newYear = substr($querydate[1]->year, 2);
        foreach ($monthName as $key => $value) {
            if(substr($querydate[0]->format('F'), 0, 3) == $value) {
                break;
            }
            array_push($monthName, $value);
            unset($monthName[$key]);
        }
        $monthName = array_values($monthName);
        foreach ($monthName as $key => $value) {
            array_push($lastYearLablesName, $value.'-'.$oldYear);
            if ($key >= array_search('Jan', $monthName)) {
                $lastYearLablesName[$key] = $value.'-'.$newYear;
            }
        }
        return $lastYearLablesName;
    }
    public function getLablesNameForChart($monthName, $start, $end, $current_month_name = null) {
        $tmp = [];
        foreach ($monthName as $key => $value) {
            array_push($tmp, $value.'-'.$start);
            if (in_array($value, ['Jan', 'Feb', 'Mar'])) {
                $tmp[$key] = $value.'-'.$end;
            }

            if ($current_month_name && $value == $current_month_name) {
                break;
            }
        }
        return $tmp;
    }

    public function getMonthData($querydate) {
        $monthData = ['4' => 0, '5' => 0, '6' => 0, '7' => 0, '8' => 0, '9' => 0, '10' => 0, '11' => 0, '12' => 0, '1' => 0, '2' => 0, '3' => 0];
        $data = Income::whereBetween('created_at', $querydate )->get();

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
