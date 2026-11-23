<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvitationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invitation_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ptId')->nullable();
            $table->integer('memberId')->nullable();
            $table->string('memberEmailID')->nullable();
            $table->dateTime('sentTime')->nullable();
            $table->integer('sentBy')->nullable();
            $table->string('otp')->nullable();
            $table->tinyInteger('status')->comment('1-Pending,2-Accepted,3-Rejected')->nullable();
            $table->dateTime('actionTime')->nullable();
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
        Schema::dropIfExists('invitation_details');
    }
}
