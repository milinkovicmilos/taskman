<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if ($request->user()->cannot('show', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this projects tasks.'
                ],
                403
            );
        }

        $tasks = $project->tasks()
            ->select('id', 'title', 'description', 'priority', 'due_date', 'completed', 'completed_at')
            ->paginate(4);

        return response()->json($tasks);
    }

    public function store(Request $request, Project $project)
    {
        if ($request->user()->cannot('createTask', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to create this task.'
                ],
                403
            );
        }

        $data = $request->validate([
            'title' => [
                'required',
                Rule::unique('tasks')->where('project_id', $project->id),
            ],
            'description' => ['required'],
            'priority' => ['integer', 'between:1,10'],
            'due_date' => ['date', 'after_or_equal:today'],
        ]);

        $project->tasks()->create($data);

        return response()->json(['message' => 'Successfully created a task.']);
    }

    public function show(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('show', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this task.'
                ],
                403
            );
        }

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'priority' => $task->priority,
            'due_date' => $task->due_date,
            'completed' => $task->completed,
            'completed_at' => $task->completed_at,
        ]);
    }

    public function update(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('update', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to update this task.'
                ],
                403
            );
        }

        $data = $request->validate([
            'title' => [
                'sometimes',
                'required',
                Rule::unique('tasks')->where('project_id', $project->id)->ignore($task),
            ],
            'description' => ['sometimes', 'required'],
            'priority' => ['integer', 'between:1,10'],
            'due_date' => ['date', 'after_or_equal:today'],
        ]);

        $task->update($data);

        return response()->json(['message' => 'Successfully updated the task.']);
    }

    public function destroy(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('destroy', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to delete this task.'
                ],
                403
            );
        }

        $task->delete();

        return response()->json(['message' => 'Successfully deleted the task.']);
    }
}
