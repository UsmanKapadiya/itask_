<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColorProjectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->string('color')->after("flag")->nullable();
            $table->string('repeat')->after("dueDate")->nullable();
            $table->string('reminder')->after("repeat")->nullable();
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
            $table->dropColumn('color');
            $table->dropColumn('repeat');
            $table->dropColumn('reminder');
        });
    }
}
