@extends('auth.common.main')

@section('content')
<div class="container">
    <div class="row justify-content-center">
            <div class="col-md-4 mt-5 mx-auto login_container">
                <h1 class="h3 mb-3 font-weight-normal text-uppercase text-center mb-5 ">
                    <span class="title">{{ __('Reset Password') }}<hr/></span>
                </h1>
            
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    <form method="POST" action="{{ route('password.update') }}">
                    @csrf

                    <input type="hidden" name="token" value="{{ $token }}">
                        <div class="form-group position-relative">
                                <span class="input_bg_image span_email"></span>
                                <input id="email" 
                                    type="email" 
                                    class="form-control @error('email') is-invalid @enderror" 
                                    name="email" 
                                    value="{{ $email ?? old('email') }}" 
                                    required autocomplete="email" autofocus>
                                 

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                        </div>

                        <div class="form-group position-relative">
                            <span class="input_bg_image span_password"></span>
                            <input id="password" 
                                   type="password" 
                                   class="form-control @error('password') is-invalid @enderror" 
                                   name="password" 
                                   placeholder="Password"
                                   required autocomplete="new-password">

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                        </div>

                        <div class="form-group position-relative">
                            <span class="input_bg_image span_confirm-password"></span>
                            <input id="confirm-password" 
                                   type="password" 
                                   class="form-control" 
                                   name="password_confirmation" 
                                   placeholder="Confirm Password"
                                   required autocomplete="new-password">
                        </div>    
                            <button
                                class="btn btn-lg btn-primary btn-block"
                            >
                                {{ __('Reset Password') }}
                                </button>
                    </form>
            </div>
    </div>
</div>
@endsection
