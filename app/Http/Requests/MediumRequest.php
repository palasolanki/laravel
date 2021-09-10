<?php

namespace App\Http\Requests;

use App\Expense;
use App\Income;
use Illuminate\Foundation\Http\FormRequest;
use App\Medium;
use Illuminate\Validation\ValidationException;
class MediumRequest extends FormRequest
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
            'medium' => 'required',
            'type' => 'required'
        ];
    }

    public function save($id = null)
    {
        if ($id) {
            $medium = Medium::where('_id', $id)->first();
            if ($medium->type != $this->type) {
                throw ValidationException::withMessages(['type' => "Can't update type of existing medium."]);
            }
        } else {
            $medium = new Medium;
        }

        $medium->medium = $this->medium;
        $medium->type = $this->type;
        $medium->save();

        if ($id && $medium->wasChanged('medium')) {
            $model = ['income' => new Income, 'expense' => new Expense ];
            $model[$medium->type]::where('medium.id', $id)->update(['medium.medium' => $medium->medium]);
        }

        return $medium;
    }
}
