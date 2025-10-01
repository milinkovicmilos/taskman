<?php

namespace App;

enum ProjectSortEnum: int
{
    case AtoZ               = 1;
    case ZtoA               = 2;
    case OwnProjectFirst    = 3;
    case GroupProjectsFrist = 4;
}
