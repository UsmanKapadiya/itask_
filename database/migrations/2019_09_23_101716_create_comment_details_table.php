<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comment_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pt_id')->nullable();
            $table->text('comment')->nullable();
            $table->integer('parentId')->nullable();
            $table->integer('parentLevel')->nullable();
            $table->string('documentName')->nullable();
            $table->float('documentSize',5,2)->nullable();
            $table->string('documentType',50)->nullable();
            $table->integer('commentedBy')->nullable();
            $table->dateTime('commentedTime')->nullable();
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
        Schema::dropIfExists('comment_details');
    }
}
