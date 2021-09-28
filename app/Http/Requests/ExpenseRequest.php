<?php

namespace App\Http\Requests;

use App\Expense;
use App\Medium;
use File;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class ExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'data.*.date'      => 'required',
            'data.*.item'      => 'required',
            'data.*.amount'    => 'required|numeric|min:0',
            'data.*.medium'    => 'required',
            'data.*.tags'      => 'required',
        ];
    }

    public function messages()
    {
        return [
            'data.*.date.required'      => 'Date is required',
            'data.*.item.required'      => 'Item is required',
            'data.*.amount.required'    => 'Amount is required',
            'data.*.amount.numeric'     => 'Amount must be a number',
            'data.*.amount.min'         => 'Amount must be a positive number',
            'data.*.medium.required'    => 'Medium is required',
            'data.*.tags.required'      => 'Tags is required',

        ];
    }

    public function save($expense = null)
    {
        foreach ($this->data as $value) {
            if (!$expense) {
                $expense = new Expense;
            }
            $medium          = Medium::find($value['medium']);
            $expense->date   = Carbon::parse($value['date']);
            $expense->item   = $value['item'];
            $expense->amount = $value['amount'];
            $expense->medium = ['id' => $medium->_id, 'medium' => $medium->medium];
            $expense->notes  = $value['notes'];
            $expense->save();
            $this->saveExpenseTags($expense, $value);
            $this->addFileAttachment($value, $expense);
            $expense = null;
        }
        return true;
    }

    public function addFileAttachment($value, $expense)
    {
        if (key_exists('file', $value)) {
            $uploadedFile = $value['file'];

            if (!File::exists(storage_path('uploads/expense/' . $expense->_id))) {
                File::makeDirectory(storage_path('uploads/expense/' . $expense->_id), $mode = 0777, true, true);
            }
            $file             = $uploadedFile->getClientOriginalName();
            $originalFileName = pathinfo($file, PATHINFO_FILENAME);
            $fileName         = $originalFileName . '-' . time() . '.' . $uploadedFile->getClientOriginalExtension();
            $uploadedFile->move(storage_path('uploads/expense/' . $expense->_id), $fileName);

            $filesArray = [];
            if ($expense->file_attachments) {
                $filesArray = $expense->file_attachments;
                array_push($filesArray, ['type' => Expense::FILE_TYPE_INVOICE, 'filename' => $fileName]);
            } else {
                $filesArray = [['type' => Expense::FILE_TYPE_INVOICE, 'filename' => $fileName]];
            }

            $expense->file_attachments = $filesArray;
            $expense->save();
        }
    }

    public function saveExpenseTags($expense, $value)
    {
        if (array_key_exists('tagsArray', $value)) {
            $expense->wasRecentlyCreated
                ? $expense->tags()->attach($value['tagsArray'])
                : $expense->tags()->sync($value['tagsArray']);
        }
    }
}
