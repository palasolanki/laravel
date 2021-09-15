<?php

namespace App\Imports;

use App\Expense;
use App\Medium;
use App\Tag;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ExpenseImport implements ToCollection, WithCustomCsvSettings
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function collection($rows)
    {
        $mediumList = Medium::all();
        foreach ($rows as $key => $row) {
            if ($key == 0) {
                continue;
            } else {
                $medium = $mediumList->where('medium', $row[3])->first();
                $tags   = explode(';', $row[4]);
                foreach ($tags as $t) {
                    $getExpenseTag = Tag::select('_id', 'type')->where('tag', $t)->first();
                    if (!$getExpenseTag) {
                        $tag       = new Tag;
                        $tag->tag  = $t;
                        $tag->type = Tag::TYPE_EXPENSE;
                        $tag->save();
                        $expenseTag[] = $tag->_id;
                        continue;
                    }
                    if ($getExpenseTag->type == Tag::TYPE_EXPENSE) {
                        $expenseTag[] = $getExpenseTag->_id;
                    }
                }
                $expense = Expense::create([
                    'date'   => Carbon::parse($row[0])->format('Y-m-d'),
                    'item'   => $row[1],
                    'amount' => $row[2],
                    'medium' => ['id' => $medium->_id, 'medium' => $medium->medium],
                    'notes'  => $row[5],
                ]);

                $expense->tags()->attach($expenseTag);
            }
        }
    }

    public function getCsvSettings(): array
    {
        return [
            'input_encoding' => 'ISO-8859-1'
        ];
    }
}
