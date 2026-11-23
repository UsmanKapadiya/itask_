<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddThumbCommentDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comment_details', function (Blueprint $table) {
            $table->string('documentThumbUrl')->nullable()->after("documentType");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comment_details', function (Blueprint $table) {
            $table->dropColumn('documentThumbUrl');
        });
    }
}
