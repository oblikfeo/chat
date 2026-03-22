<?php

namespace App\Models;

use App\Support\JsonColumnQuery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessageFile extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];
    protected $hidden = ['deleted_in_id'];

    public function sent_by() 
    {
        $driver = $this->getConnection()->getDriverName();
        $uid = auth()->id();

        if ($driver === 'sqlite') {
            return $this->belongsTo(User::class, 'sent_by_id')
                ->selectRaw("id, CASE WHEN id = ? THEN 'You' ELSE name END as name, avatar", [$uid]);
        }

        return $this->belongsTo(User::class, 'sent_by_id')
            ->selectRaw('id, IF (id = ?, "You", name) as name, avatar', [$uid]);
    }

    public function scopeDeletedInIds(Builder $query) 
    {
        JsonColumnQuery::applyDeletedInIdsScope($query);
    }
}
