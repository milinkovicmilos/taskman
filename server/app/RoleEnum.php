<?php

namespace App;

enum RoleEnum: int
{
    case Owner      = 1;
    case Moderator  = 2;
    case Member     = 3;
}
