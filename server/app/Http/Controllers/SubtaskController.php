<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function index(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('show', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this projects tasks.'
                ],
                403
            );
        }

        $subtasks = $task->subtasks()
            ->select('id', 'text', 'completed', 'completed_at')
            ->paginate(4);

        return response()->json($subtasks);
    }
}
