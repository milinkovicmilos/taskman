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

        $response = [
            'message' => 'Successfully registered.',
            'data' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
            ],
        ];

        $isMobile = $request->header('X-Client-Type') === 'mobile';
        if ($isMobile) {
            $token = $user->createToken('mobile')->plainTextToken;
            $response['data']['token'] = $token;
        } else {
            Auth::login($user);
        }

        return response()->json($response);
    }
}
