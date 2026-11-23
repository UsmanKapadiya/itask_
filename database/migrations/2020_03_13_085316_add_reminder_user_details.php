<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddReminderUserDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->string('automatic_reminder')->default("No default reminder")->nullable()->after("allowNotification");
            $table->boolean('remind_via_email')->default(1)->after("automatic_reminder");
            $table->string('remind_via_mobile_notification')->default(1)->after("remind_via_email");
            $table->string('remind_via_desktop_notification')->default(1)->after("remind_via_mobile_notification");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->dropColumn('automatic_reminder');
            $table->dropColumn('remind_via_email');
            $table->dropColumn('remind_via_mobile_notification');
            $table->dropColumn('remind_via_desktop_notification');
        });
    }
}
