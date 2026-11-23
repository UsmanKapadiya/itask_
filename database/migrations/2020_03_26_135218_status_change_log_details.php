<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StatusChangeLogDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('status_log_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ptId')->nullable();
            $table->tinyInteger('status')->nullable();
            $table->integer('userBy')->nullable();
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
        Schema::dropIfExists('status_log_details');
    }
}
