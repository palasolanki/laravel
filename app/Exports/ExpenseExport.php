<?php

namespace App\Exports;

use App\Expense;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

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
        $to = ($this->request->daterange[1]) ? Carbon::parse($this->request->daterange[1]) : null;

        $selectedMediums = $this->request->mediums;
        $selectedTags = $this->request->tags;
        return Expense::with('tags')
                ->when($from, function ($expense) use ($from, $to) {
                    return $expense->whereBetween('date', [$from, $to]);
                })
                ->when($selectedMediums, function ($expense) use ($selectedMediums) {
                    return $expense->whereIn('medium.id', $selectedMediums);
                })
                ->when($selectedTags, function ($expense) use ($selectedTags) {
                    return $expense->whereIn('tag_ids', $selectedTags);
                });
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
            $expense->date,
            $expense->item,
            $expense->amount,
            $expense->medium['medium'],
            $expense->note ?? 'N/A',
            implode(', ', $expense->tags->pluck('tag')->toArray()),
        ];
    }
}
