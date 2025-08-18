<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $credentials = $request->validate([
            'first_name' => ['required', 'max:255'],
            'last_name' => ['required', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                Password::min(8)->letters()->numbers()->mixedCase()->symbols(),
                'confirmed'
            ],
        ]);

        $user = User::create($credentials);
        Auth::login($user);

        return response()->json(['message' => 'Successfully registered.']);
    }
}
