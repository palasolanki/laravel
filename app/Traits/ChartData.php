<?php

namespace App\Traits;

use App\Expense;
use App\Income;
use Illuminate\Support\Carbon;

trait ChartData {
    public function getChartData($chart_range, $from) {
        $today = Carbon::now();
        $labels = [];

        if($chart_range == 'current_year') {

            $querydate = $this->getCurrentYearQueryDateRange($today);
            $labels = $this->getCurrentYearLabels($today);

        } elseif ($chart_range == 'past_year') {

            $querydate = $this->getPastYearQueryDateRange($today);
            $labels = $this->getPastYearLabels($today);

        } else {
            $querydate = [
                Carbon::createFromDate($today->year-1, $today->month+1, 1)->startOfMonth(),
                Carbon::createFromDate($today->year, $today->month, 1)->endOfMonth()
            ];
            $labels = $this->getLast12MonthsLabels($querydate);
        }

        $monthData = $this->getMonthData($querydate, $from);

        $monthData = ($chart_range != 'current_year') ? $monthData : $this->getMonthDataForCurrentYear($monthData, $today->month);
        $monthData = ($chart_range != 'last_12_month') ? $monthData : $this->getMonthDataForLastYear($monthData, $querydate);

        return [array_values($monthData), $labels];
    }

    public function getCurrentYearQueryDateRange($today) {
        $current_year = $today->year;
        $starYear = (in_array($today->month, [1,2,3])) ? $current_year - 1 : $current_year;

        $querydate = [
            Carbon::createFromDate($starYear, 4, 1)->startOfMonth(),
            Carbon::createFromDate($current_year, $today->month, $today->day)->endOfDay()
        ];
        return $querydate;
    }

    public function getCurrentYearLabels($today) {
        $current_year = $today->year;
        $currentLabelYearForStart = (in_array($today->month, [1,2,3])) ? substr($current_year-1, 2) : substr($current_year, 2);
        $currentLabelYearForEnd = (in_array($today->month, [1,2,3])) ? substr($current_year, 2) : substr($current_year + 1, 2);

        return $this->getLabelsForChart($currentLabelYearForStart, $currentLabelYearForEnd, substr($today->format('F'), 0, 3));
    }

    public function getPastYearQueryDateRange($today) {
        $current_year = $today->year;
        $startPastYear = (in_array($today->month, [1,2,3])) ? $current_year-2 : $current_year-1;
        $endPastYear = (in_array($today->month, [1,2,3])) ? $current_year-1 : $current_year;
        $querydate = [
            Carbon::createFromDate($startPastYear, 4, 1)->startOfMonth(),
            Carbon::createFromDate($endPastYear, 3, 31)->endOfMonth()
        ];
        return $querydate;
    }

    public function getPastYearLabels($today) {
        $current_year = $today->year;
        $pastLabelYearForStart = (in_array($today->month, [1,2,3])) ? substr($current_year-2, 2) : substr($current_year-1, 2);
        $pastLabelYearForEnd = (in_array($today->month, [1,2,3])) ? substr($current_year-1, 2) : substr($current_year, 2);

        return $this->getLabelsForChart($pastLabelYearForStart, $pastLabelYearForEnd);
    }

    public function getLast12MonthsLabels($querydate) {
        $monthName = $this->getLast12MonthsName($querydate);
        return $this->setYearInMonthForLabels($querydate, $monthName);
    }

    public function getLast12MonthsName($querydate) {
        $monthName = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        $lastMonth = substr($querydate[0]->format('F'), 0, 3);

        foreach ($monthName as $key => $value) {
            if($lastMonth == $value) {
                break;
            }
            array_push($monthName, $value);
            unset($monthName[$key]);
        }
        return array_values($monthName);
    }

    public function setYearInMonthForLabels($querydate, $monthName) {
        $lastYearLabels = [];
        $oldYear = substr($querydate[0]->year, 2);
        $newYear = substr($querydate[1]->year, 2);

        foreach ($monthName as $key => $value) {
            if ($key >= array_search('Jan', $monthName)) {
                $lastYearLabels[$key] = $value.'-'.$newYear;
            } else {
                $lastYearLabels[$key] = $value.'-'.$oldYear;
            }
        }
        return $lastYearLabels;
    }

    public function getLabelsForChart($start, $end, $current_month_name = null) {
        $tmp = [];
        $monthName = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
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

    public function getMonthData($querydate, $from) {
        $monthData = ['4' => 0, '5' => 0, '6' => 0, '7' => 0, '8' => 0, '9' => 0, '10' => 0, '11' => 0, '12' => 0, '1' => 0, '2' => 0, '3' => 0];

        $data = ($from == 'income') ? Income::whereBetween('date', $querydate)->get() : Expense::whereBetween('date', $querydate)->get();

        foreach ($data as $value) {
            $date = Carbon::parse($value->date);
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
