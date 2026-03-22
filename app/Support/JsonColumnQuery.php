<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;

/**
 * Совместимость JSON-условий: MySQL (JSON_SEARCH) и SQLite (json_each/json_extract).
 */
final class JsonColumnQuery
{
    public static function applyDeletedInIdsScope(Builder $query): void
    {
        $userId = auth()->id();
        $driver = $query->getConnection()->getDriverName();

        $query->where(function (Builder $q) use ($userId, $driver) {
            $q->whereNull('deleted_in_id');

            if ($driver === 'sqlite') {
                $q->orWhereRaw(
                    'NOT EXISTS (SELECT 1 FROM json_each(deleted_in_id) AS e WHERE json_extract(e.value, \'$.id\') = ?)',
                    [$userId]
                );
            } else {
                $q->orWhereRaw(
                    "JSON_SEARCH(deleted_in_id, 'ONE', ?, NULL, '$[*].id') IS NULL",
                    [$userId]
                );
            }
        });
    }

    public static function applyNotSeenScope(Builder $query): void
    {
        $userId = auth()->id();
        $driver = $query->getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            $query->whereRaw(
                'NOT EXISTS (SELECT 1 FROM json_each(seen_in_id) AS e WHERE json_extract(e.value, \'$.id\') = ?)',
                [$userId]
            );
        } else {
            $query->whereRaw(
                "JSON_SEARCH(seen_in_id, 'ONE', ?, NULL, '$[*].id') IS NULL",
                [$userId]
            );
        }
    }
}
