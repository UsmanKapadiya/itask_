@extends('auth.common.main')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            @if ($errors->any())
                <div class="w-100 text-center mt-5">
                    @foreach ($errors->all() as $error)
                        <div class="alert alert-danger" role="alert">
                            {{ $error }}
                        </div>
                    @endforeach
                </div>
            @else
                <div class="col-md-4 mt-5 mx-auto login_container">
                    <h1 class="h3 mb-3 font-weight-normal text-uppercase text-center mb-5">
                        <span class="title color-white">{{ __('Change Password') }}<hr/></span>
                    </h1>
                    <form method="POST" action="{{ route('change-password') }}">
                        @csrf
                        <input type="hidden" name="email" value="{{ base64_encode(base64_encode($email)) }}"/>
                        <div class="form-group position-relative">
                            <span class="input_bg_image span_password"></span>
                            <input id="password" type="password" class="form-control"
                                   name="password" value="{{ old('password') }}" placeholder="Password" required
                                   autofocus maxlength="6">
                        </div>
                        <div class="form-group position-relative">
                            <span class="input_bg_image span_confirm-password"></span>
                            <input id="confirm-password" type="password"
                                   class="form-control"
                                   name="password_confirmation" value="{{ old('password_confirmation') }}"
                                   placeholder="Confirm password" required maxlength="6">
                        </div>
                        @if (session('status'))
                            <label class="error w-100 mt-2 text-center">{{ session('status') }}</label>
                        @endif
                        <div class="text-center mt-5">
                            <button type="submit" class="reset-password-btn"><img
                                    src='{{ asset("images/btn_next.png") }}' width="50"/></button>
                        </div>
                    </form>
                </div>
            @endif
        </div>
    </div>
@endsection
