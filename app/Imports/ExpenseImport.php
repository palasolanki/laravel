<?php

namespace App\Imports;

use App\Expense;
use App\Models\Medium;
use App\Tag;
use Exception;
use MongoDB\Client;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Facades\DB;

class ExpenseImport implements ToCollection, WithCustomCsvSettings
{

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */


    public function collection($rows)
    {
        foreach ($rows as $row) {
            $medium = Medium::where('medium', $row[3])->first();
            logger($medium);
            $tags = explode(";", $row[4]);
            foreach ($tags as $t) {
                $getExpenseTag = Tag::select('_id', 'type')->where('tag', $t)->first();
                if (!$getExpenseTag) {
                    $tag = new Tag;
                    $tag->tag = $t;
                    $tag->type = 'expense';
                    $tag->save();
                    $expenseTag[] = $tag->_id;
                    continue;
                }
                if ($getExpenseTag->type == 'expense') {
                    $expenseTag[] = $getExpenseTag->_id;
                }
            }

            $expense = Expense::create([
                'date' => $row[0],
                'item' => $row[1],
                'amount' => $row[2],
                'medium' => ['id' => $medium->_id, 'medium' => $medium->medium],
                'tag_ids' => $expenseTag,
                'notes' => $row[5],
            ]);

            $expense->tags()->attach($expenseTag);
        }
    }
    public function getCsvSettings(): array
    {
        return [
            'input_encoding' => 'ISO-8859-1'
        ];
    }
}
