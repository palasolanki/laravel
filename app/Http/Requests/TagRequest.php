<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Tag;
class TagRequest extends FormRequest
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
            'tag' => 'required',
            'type' => 'required'
        ];
    }

    public function save($id = null)
    {
        if ($id) {
            $tag = Tag::where('_id', $id)->first();
        } else {
            $tag = new Tag;
        }
        
        $tag->tag = $this->tag;
        $tag->type = $this->type;
        $tag->save();

        return $tag;
    }
}
