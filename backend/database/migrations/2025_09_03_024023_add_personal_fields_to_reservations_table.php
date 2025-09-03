<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // 追加フィールド(「お名前」は使わず、姓/名で保持)
            $table->string('last_name')->nullable()->comment('姓');
            $table->string('first_name')->nullable()->comment('名');
            $table->string('email')->nullable()->comment('メールアドレス');
            $table->string('phone')->nullable()->comment('電話番号');
            $table->string('notebook_type')->nullable()->comment('手帳の種別');
            $table->string('has_certificate')->default(false)->comment('受給者証の有無');

            // よく検索するならインデックス
            $table->index(['last_name', 'first_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex(['last_name', 'first_name']);
            $table->dropColumn([
                'last_name',
                'first_name',
                'email',
                'phone',
                'notebook_type',
                'has_certificate',
            ]);
        });
    }
};
