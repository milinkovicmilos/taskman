<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $response = [
                'message' => 'Successfully authenticated.',
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
                $request->session()->regenerate();
            }

            return response()->json($response);
        }

        return response()->json(['message' => 'Failed to authenticate with provided credentials.'], 401);
    }

    public function logout(Request $request)
    {
        $isMobile = $request->header('X-Client-Type') === 'mobile';
        if ($isMobile) {
            $request->user()->currentAccessToken()->delete();
        } else {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Successfully logged out.']);
    }
}
