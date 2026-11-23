<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserNotificationSettingDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_setting_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('userId')->nullable();
            $table->string('notificationType')->nullable();
            $table->boolean('email')->default(1)->nullable();
            $table->boolean('pushNotification')->default(1)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notification_setting_details');
    }
}
