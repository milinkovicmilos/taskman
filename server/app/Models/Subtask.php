<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Subtask extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'text',
        'completed',
        'completed_at',
    ];

    protected static function booted()
    {
        static::creating(function ($subtask) {
            if (Auth::check()) {
                $subtask->user_id = Auth::id();
            }
        });
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
