<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class VerificationController extends Controller
{
    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend');
    }
}
