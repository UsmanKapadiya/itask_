<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class ResetPasswordController extends Controller
{
    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('guest');
    }
}
