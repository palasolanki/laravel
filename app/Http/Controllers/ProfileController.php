<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use App\Http\Resources\Token;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    public function update(ProfileRequest $request) {
        $data = $request->all();
        $user = auth()->user();
        $user->update($data);
        auth()->guard('api')->invalidate();
        return new Token(JWTAuth::fromUser($user));
    }

}
