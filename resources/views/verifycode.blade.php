@extends('auth.common.main')
@section('content')
    @if ($errors->any())
        <div class="w-50 text-center mt-5">
            @foreach ($errors->all() as $error)
                <div class="alert alert-danger" role="alert">
                    {{ $error }}
                </div>
            @endforeach
        </div>
    @else
        <div class="col-md-8 verifycode_container" id="verifycode" email="{{ isset($email) ? $email : "" }}"></div>
    @endif

@endsection
