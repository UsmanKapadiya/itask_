@extends('auth.common.main')

@section('content')
    <div class="otp_container w-25 mt-5 mx-auto">
        @if ($errors->any())
            <div class="w-100 text-center mt-5">
                @foreach ($errors->all() as $error)
                    <div class="alert alert-danger" role="alert">
                        {{ $error }}
                    </div>
                @endforeach
            </div>
        @else
            <h1 class="title text-uppercase text-center color-white">Enter OTP
                <hr/>
            </h1>
            <p class="text-center mt-5">We have sent you OTP via email for email verification</p>
            <p class="text-center mt-5 mb-3">Enter code here</p>
            <form method="POST" action="{{ route('verify-otp') }}">
                @csrf
                <input type="hidden" name="email" value="{{ base64_encode(base64_encode($email)) }}"/>
                <div class="d-flex justify-content-center">
                    <input type="text" class="form-control mx-2 rounded" required name="otp[0]" maxLength="1"
                           autocomplete="nope" value="{{ old('otp')[0] }}" autofocus="autofocus"/>
                    <input type="text" class="form-control mx-2 rounded" required name="otp[1]" maxLength="1"
                           autocomplete="nope" value="{{ old('otp')[1] }}"/>
                    <input type="text" class="form-control mx-2 rounded" required name="otp[2]" maxLength="1"
                           autocomplete="nope" value="{{ old('otp')[2] }}"/>
                    <input type="text" class="form-control mx-2 rounded" required name="otp[3]" maxLength="1"
                           autocomplete="nope" value="{{ old('otp')[3] }}"/>
                </div>
                @if (session('status'))
                    <label class="error w-100 mt-3 text-center">{{ session('status') }}</label>
                @endif
                <div class="text-center mt-5">
                    <button type="submit">
                        <img src="{{ asset("images/btn_next.png")  }}" width="50"/>
                    </button>
                </div>
            </form>
            <a href='{{ url("resend-otp/".base64_encode(base64_encode($email))) }}' class="text-center d-block mt-3">Resend
                the OTP</a>
        @endif
    </div>
@endsection
