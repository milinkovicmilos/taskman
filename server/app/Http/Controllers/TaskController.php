<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $user = Auth::user();

        if ($request->user()->cannot('show', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this projects tasks.'
                ],
                403
            );
        }

        $tasks = $project
            ->tasks()
            ->select('id', 'title', 'description', 'priority', 'due_date', 'completed')
            ->with('subtasks:id,task_id,text,completed')
            ->paginate(4);

        return response()->json($tasks);
    }

    public function show(Request $request, Project $project, Task $task)
    {
        $user = Auth::user();

        if ($request->user()->cannot('show', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this projects tasks.'
                ],
                403
            );
        }

        $subtasks = $task->subtasks()
            ->select('id', 'text', 'completed')
            ->get();

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'priority' => $task->priority,
            'due_date' => $task->due_date,
            'completed' => $task->completed,
            'subtasks' => $subtasks,
        ]);
    }
}
