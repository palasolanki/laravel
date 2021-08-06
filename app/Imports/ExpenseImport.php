<?php

namespace App\Imports;

use App\Expense;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ExpenseImport implements ToCollection, WithCustomCsvSettings
{

    //with heading row
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    // public function model(array $row)
    // {
    //     return new Expense([
    //         'date' => $row['Date'],
    //         'item' => $row['Item'],
    //         'amount' => $row['Amount'],
    //         'medium' => $row['Medium'],
    //         'tags' => $row['Tags'],
    //         'notes' => $row['Notes'],
    //     ]);
    // }

    public function collection($rows)
    {
        foreach ($rows as $row) {
            Expense::create([
                'date' => $row[0],
                'item' => $row[1],
                'amount' => $row[2],
                'medium' => $row[3],
                'tags' => $row[4],
                'notes' => $row[5],
            ]);
            // User::create([
            //     'name' => $row[0],
            // ]);
        }
    }
    public function getCsvSettings(): array
    {
        return [
            'input_encoding' => 'ISO-8859-1'
        ];
    }
}
