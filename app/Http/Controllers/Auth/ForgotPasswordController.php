<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class ForgotPasswordController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('guest');
    }
}
