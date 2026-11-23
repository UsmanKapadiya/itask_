<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDuedatetimeProjectDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->date('dueDate')->nullable()->change();
            $table->string('dueDateTime',10)->nullable()->after("dueDate");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->dateTime('dueDate')->nullable()->change();
            $table->dropColumn('dueDateTime');
        });
    }
}
