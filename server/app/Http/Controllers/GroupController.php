<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $groups = $user->memberships()
            ->with('group:id,name')
            ->get()
            ->pluck('group');

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => ['required'],
        ]);

        $group = Group::create($data);
        $group->memberships()->create([
            'user_id' => $user->id,
            'role_id' => RoleEnum::Owner->value,
        ]);

        return response()->json(['message' => 'Successfully created a group.']);
    }

    public function show(Request $request, Group $group)
    {
        if ($request->user()->cannot('show', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this group.'
                ],
                403
            );
        }

        return response()->json([
            'id' => $group->id,
            'name' => $group->name,
        ]);
    }

    public function update(Request $request, Group $group)
    {
        if ($request->user()->cannot('update', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to update this group.'
                ],
                403
            );
        }

        $data = $request->validate([
            'name' => ['sometimes', 'required'],
        ]);

        $group->update($data);

        return response()->json(['message' => 'Successfully updated the group.']);
    }

    public function destroy(Request $request, Group $group)
    {
        if ($request->user()->cannot('destroy', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to delete this group.'
                ],
                403
            );
        }

        $group->delete();

        return response()->json(['message' => 'Successfully deleted the group.']);
    }
}
