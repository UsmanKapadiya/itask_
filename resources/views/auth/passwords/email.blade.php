@extends('auth.common.main')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4 mt-5 mx-auto login_container">
                <h1 class="h3 mb-3 font-weight-normal text-uppercase text-center mb-5">
                    <span class="title color-white">{{ __('Forgot Password') }}<hr/></span>
                </h1>

                @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                @endif

                <form method="POST" action="{{ route('password-reset') }}">
                    @csrf

                    <div class="form-group position-relative">
                        <span class="input_bg_image span_email"></span>
                        <input id="email"
                               type="email"
                               class="form-control @error('email') is-invalid @enderror"
                               name="email"
                               value="{{ old('email') }}"
                               placeholder="Enter email"
                               required autocomplete="email" autofocus>

                        @error('email')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div class="text-center mt-5">
                        <button type="submit" class="reset-password-btn"><img src='{{ asset("images/btn_next.png") }}' width="50"/></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
