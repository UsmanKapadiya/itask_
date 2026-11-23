<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangesStatusLogDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('status_log_details', function (Blueprint $table) {
            $table->integer('newly_created_id')->after("ptId")->default(0);
        });
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->tinyInteger('repeated_count')->after("send_to_review_time")->default(0);
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
            $table->dropColumn('newly_created_id');
        });
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->dropColumn('repeated_count');
        });
    }
}
