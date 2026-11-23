<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('email');
            $table->string('password');
            $table->tinyInteger('type')->nullable()->comment("1-ios,2-android");
            $table->tinyInteger('deviceType')->nullable()->comment("1-mobile,2-tablet/ipad");
            $table->string('deviceToken')->nullable();
            $table->string('deviceId')->nullable();
            $table->tinyInteger('allowNotification')->default(0)->comment("0-Notallow,1-Allow");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_details');
    }
}
