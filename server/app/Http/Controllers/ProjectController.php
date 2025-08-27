<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Project;
use App\Models\Task;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userProjects = Project::select('id', 'name')
            ->where('user_id', $user->id);

        $groupProjects = Project::select('projects.id', 'projects.name')
            ->join('groups', 'groups.id', '=', 'projects.group_id')
            ->join('memberships', 'memberships.group_id', '=', 'groups.id')
            ->where('memberships.user_id', $user->id)
            ->where('memberships.role_id', '!=', RoleEnum::Owner->value);

        $allProjectsQuery = $userProjects->union($groupProjects);

        return response()->json($allProjectsQuery->paginate(4));
    }

    public function groupProjects(Request $request, Group $group)
    {
        if ($request->user()->cannot('show', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this groups projects.'
                ],
                403
            );
        }

        return $group->projects()
            ->select('id', 'name')
            ->get();
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => [
                'required',
                Rule::unique('projects')->where('user_id', $user->id),
            ]
        ]);

        $project = $user->projects()->create([
            'name' => $data['name']
        ]);

        return response()->json([
            'message' => 'Successfully created a project.',
            'data' => [
                'id' => $project->id,
            ],
        ]);
    }

    public function show(Request $request, Project $project)
    {
        if ($request->user()->cannot('show', $project)) {
            return response()->json(['message' => 'You are not allowed to see this project.'], 403);
        }

        $user = Auth::user();

        return response()->json([
            'id' => $project->id,
            'name' => $project->name,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        if ($request->user()->cannot('update', $project)) {
            return response()->json(['message' => 'You are not allowed to update this project.'], 403);
        }

        $user = Auth::user();

        $data = $request->validate([
            'name' => [
                'required',
                Rule::unique('projects')->where('user_id', $user->id)->ignore($project),
            ]
        ]);

        $project->update([
            'name' => $data['name'],
        ]);

        return response()->json(['message' => 'Successfully updated the post.']);
    }

    public function destroy(Request $request, Project $project)
    {
        if ($request->user()->cannot('delete', $project)) {
            return response()->json(['message' => 'You are not allowed to delete this project.'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Successfully deleted a project.']);
    }
}
