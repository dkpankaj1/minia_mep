<?php

use App\Models\PermissionGroup;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->date('expense_date'); // Renamed for clarity
            $table->string('title', 100); // Added length constraint
            $table->decimal('amount', 10, 2)->unsigned(); // Added unsigned for positive values
            $table->text('description')->nullable(); // Changed to text for longer descriptions
            $table->string('attachment', 255)->nullable(); // Added length constraint
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('user_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();

            // Added indexes for better query performance
            $table->index(['user_id', 'status']);
            $table->index('expense_date');
        });

        /**
         * Seed Permission :: Bedin
         */
        $permissions = [
            'Expense Management' => ['expense.index', 'expense.create', 'expense.edit', 'expense.delete'],
        ];

        foreach ($permissions as $groupName => $groupPermissions) {
            $group = PermissionGroup::create(['name' => $groupName]);
            foreach ($groupPermissions as $permission) {
                Permission::create(['name' => $permission, 'permission_group_id' => $group->id]);
            }
        }
        /**
         * Seed Permission :: End
         */

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
