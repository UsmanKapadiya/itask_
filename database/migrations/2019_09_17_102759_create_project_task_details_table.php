<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectTaskDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_task_details', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->dateTime('dueDate')->nullable();
            $table->tinyInteger('flag')->nullable();
            $table->text('note')->nullable();
            $table->tinyInteger('type')->comment('1-Project,2-Task')->nullable();
            $table->integer('parentId')->nullable();
            $table->integer('parentLevel')->nullable();
            $table->tinyInteger('status')->comment('1-Active,2-Overdue,3-Completed,4-Review,5-OnHold')->nullable();
            $table->string('tags')->nullable();
            $table->integer('createdBy')->nullable();
            $table->integer('updatedBy')->nullable();
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
        Schema::dropIfExists('project_task_details');
    }
}
