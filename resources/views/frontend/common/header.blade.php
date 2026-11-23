<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link href="{{asset ('css/bootstrap.min.css')}}" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">
        <link href="{{ asset('css/font-awesome.css') }}" rel="stylesheet">
        <script src ="{{asset ('js/bootstrap.min.js')}}"></script>
    </head>
    <body>
        <main>
            <div class="container-fluid bg-wildblue">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4">
                            <h1 class="color-white">iTask</h1>
                        </div>
                        <div class="col-md-4">
                                <div class="input-group mt-2">
                                    <div class="input-group-prepend">
                                        <button class="search-button" type="submit"><img
                                                src="{{asset('images/btn_search.png')}}" alt="Search"></button>
                                    </div>
                                    <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1">
                                </div>
{{--                            <div class="d-flex justify-content-center h-100">--}}
{{--                                <div class="searchbar">--}}
{{--                                    <a href="#" class="search_icon"><i class="fas fa-search"></i></a>--}}
{{--                                    <input class=" form-control search_input" type="text" name="" placeholder="Search...">--}}
{{--                                </div>--}}
{{--                            </div>--}}
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex">
                                <a href="#"><i class="fas fa-plus"></i></a>
                                <a href="#"></a>
                                <a href="#"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </body>
</html>
