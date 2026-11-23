<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProductDocumentSize extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('document_details', function (Blueprint $table) {
            $table->float('size',8,2)->change();
            $table->text('type')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('document_details', function (Blueprint $table) {
            $table->float('size',5,2)->change();
            $table->string('type',50)->change();
        });
    }
}
