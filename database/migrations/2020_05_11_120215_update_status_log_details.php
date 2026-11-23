<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStatusLogDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('status_log_details', function (Blueprint $table) {
            $table->dropColumn('newly_created_id');
            $table->string('oldDueDate')->after("ptId")->nullable();
            $table->string('oldDueDateTime')->after("oldDueDate")->nullable();
        });
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->dropColumn('repeated_count');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('status_log_details', function (Blueprint $table) {
            $table->integer('newly_created_id')->after("ptId")->default(0);
            $table->dropColumn('oldDueDate');
            $table->dropColumn('oldDueDateTime');
        });
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->tinyInteger('repeated_count')->after("send_to_review_time")->default(0);
        });
    }
}
