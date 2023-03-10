<?php

namespace App\Exports;

use App\Expense;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExpenseExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function query()
    {
        $from = ($this->request->daterange[0]) ? Carbon::parse($this->request->daterange[0]) : null;
        $to   = ($this->request->daterange[1]) ? Carbon::parse($this->request->daterange[1]) : null;

        $selectedMediums = $this->request->mediums;
        $selectedTags    = $this->request->tags;
        return Expense::with('tags')
                ->when($from, function ($expense) use ($from, $to) {
                    return $expense->whereBetween('date', [$from, $to]);
                })
                ->when($selectedMediums, function ($expense) use ($selectedMediums) {
                    return $expense->whereIn('medium.id', $selectedMediums);
                })
                ->when($selectedTags, function ($expense) use ($selectedTags) {
                    return $expense->whereIn('tag_ids', $selectedTags);
                })->orderBy('date');
    }

    public function headings(): array
    {
        return [
            'Id',
            'Date',
            'Item',
            'Amount (INR)',
            'Medium',
            'Note',
            'Tags',
        ];
    }

    public function map($expense): array
    {
        return [
            $expense->_id,
            Carbon::parse($expense->date)->format('d-m-Y'),
            $expense->item,
            $expense->amount,
            $expense->medium['medium'] ?? 'N/A',
            $expense->notes ?? 'N/A',
            implode(', ', $expense->tags->pluck('tag')->toArray()),
        ];
    }
}
