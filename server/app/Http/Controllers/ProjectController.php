<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Project;
use App\Models\Task;
use App\ProjectSortEnum;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'per_page' => ['sometimes', 'numeric'],
            'keyword' => ['sometimes'],
            'order' => ['sometimes',  Rule::enum(ProjectSortEnum::class)],
        ]);

        $user = Auth::user();
        $userProjects = Project::select('id', 'name', 'description')
            ->where('user_id', $user->id);

        $groupProjects = Project::select('projects.id', 'projects.name', 'projects.description')
            ->join('groups', 'groups.id', '=', 'projects.group_id')
            ->join('memberships', 'memberships.group_id', '=', 'groups.id')
            ->where('memberships.user_id', $user->id)
            ->where('memberships.role_id', '!=', RoleEnum::Owner->value);

        $keyword = $request->input('keyword');
        if (!is_null($keyword)) {
            $userProjects->where(DB::raw('LOWER(projects.name)'), 'LIKE', '%' . strtolower($keyword) . '%');
            $groupProjects->where(DB::raw('LOWER(projects.name)'), 'LIKE', '%' . strtolower($keyword) . '%');
        }

        $order = ProjectSortEnum::tryFrom($request->input('order'));
        if (is_null($order) || $order === ProjectSortEnum::AtoZ || $order === ProjectSortEnum::ZtoA) {
            $allProjectsQuery = $userProjects->union($groupProjects);
        }

        switch ($order) {
            case ProjectSortEnum::AtoZ:
                $allProjectsQuery->orderBy('name', 'asc');
                break;

            case ProjectSortEnum::ZtoA:
                $allProjectsQuery->orderBy('name', 'desc');
                break;

            case ProjectSortEnum::OwnProjectFirst:
                $allProjectsQuery = $userProjects->union($groupProjects);
                break;

            case ProjectSortEnum::GroupProjectsFrist:
                $allProjectsQuery = $groupProjects->union($userProjects);
                break;
        }

        $perPage = $request->input('per_page');
        if (is_null($perPage)) {
            $perPage = 8;
        }

        return response()->json($allProjectsQuery->paginate($perPage));
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

        return response()->json($group->projects()
            ->select('id', 'name', 'description')
            ->paginate(4));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => [
                'required',
                Rule::unique('projects')->where('user_id', $user->id)->whereNull('deleted_at'),
            ],
            'description' => [
                'required',
            ],
            'group_id' => [
                'sometimes',
                Rule::exists('groups', 'id'),
            ],
        ]);

        $project = $user->projects()->create($data);

        return response()->json([
            'message' => 'Successfully created a project.',
            'data' => [
                'id' => $project->id,
            ],
        ]);
    }

    public function storeGroupProject(Request $request, Group $group)
    {
        if ($request->user()->cannot('createProject', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to create projects in this group.'
                ],
                403
            );
        }

        $this->store($request);
    }

    public function show(Request $request, Project $project)
    {
        if ($request->user()->cannot('show', $project)) {
            return response()->json(['message' => 'You are not allowed to see this project.'], 403);
        }

        $user = Auth::user();
        $role = $project->group?->memberships()
            ->where('user_id', $user->id)
            ->value('role_id');

        if (is_null($role)) {
            $role = RoleEnum::Owner;
        }

        $groupName = $project->group?->name;
        $canCreateTasks = $request->user()->can('createTask', $project);

        return response()->json([
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description,
            'role' => $role,
            'can_create_tasks' => $canCreateTasks,
            'group_name' => $groupName,
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
                'sometimes',
                'required',
                Rule::unique('projects')->where('user_id', $user->id)->ignore($project),
            ],
            'description' => [
                'sometimes',
                'required',
            ],
        ]);

        $project->update($data);

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
