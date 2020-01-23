<?php

namespace App\Http\Controllers;

use App\Http\Resources\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $this->validate($request, ['email' => 'required|email', 'password' => 'required']);

        $credentials = $request->only('email', 'password');
        if ($token = Auth::guard('api')->attempt($credentials)) {
            return new Token($token);
        }

        return response()->json(['message' => 'Email or password is incorrect, please try again.'], 401);
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
