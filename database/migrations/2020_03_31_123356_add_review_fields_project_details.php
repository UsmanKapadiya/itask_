<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddReviewFieldsProjectDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_task_details', function (Blueprint $table) {
            $table->string('send_to_review_by')->after("tags")->nullable();
            $table->dateTime('send_to_review_time')->after("send_to_review_by")->nullable();
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
            $table->dropColumn('send_to_review_by');
            $table->dropColumn('send_to_review_time');
        });
    }
}
