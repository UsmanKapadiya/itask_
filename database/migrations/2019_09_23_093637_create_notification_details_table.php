<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_details', function (Blueprint $table) {
            $table->increments('id');
            $table->string('notificationType',50)->nullable();
            $table->text('notificationText')->nullable();
            $table->dateTime('sentTime')->nullable();
            $table->integer('sentBy')->nullable();
            $table->integer('sentTo')->nullable();
            $table->mediumText('parameters')->nullable();
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
        Schema::dropIfExists('notification_details');
    }
}
