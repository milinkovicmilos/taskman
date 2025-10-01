<?php

namespace App;

enum TaskSortEnum: int
{
    case Newest             = 1;
    case Oldest             = 2;
    case HighestPriority    = 3;
    case LowestPriority     = 4;
}
