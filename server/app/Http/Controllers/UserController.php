<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'search' => ['required'],
        ]);

        $users = DB::table('users')
            ->select('id', 'first_name', 'last_name', 'email')
            ->where(DB::raw('LOWER(first_name)'), 'LIKE', '%' . strtolower($data['search']) . '%')
            ->orWhere(DB::raw('LOWER(last_name)'), 'LIKE', '%' . strtolower($data['search']) . '%')
            ->orWhere(DB::raw('LOWER(email)'), 'LIKE', '%' . strtolower($data['search']) . '%')
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->take(8)
            ->get();

        return response()->json([
            'message' => 'Successfully retrieved data.',
            'data' => $users,
        ]);
    }
}
