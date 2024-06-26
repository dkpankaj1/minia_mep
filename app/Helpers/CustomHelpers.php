<?php

namespace App\Helpers;

use Illuminate\Support\Facades\File;

class CustomHelpers
{
    public static function getLogs($limit = 10)
    {

        $logFile = storage_path('logs/laravel.log');

        if (!File::exists($logFile)) {
            return view('logs', ['logs' => []]);
        }
        $logs = File::lines($logFile)->reverse()->take($limit);
        $logData = [];

        foreach ($logs as $log) {
            // Simple parsing example, adjust as necessary for your log format
            preg_match('/\[(.*?)\] (.*?): (.*)/', $log, $matches);

            if (isset($matches[1], $matches[2], $matches[3])) {
                $logData[] = [
                    'date' => $matches[1],
                    'type' => $matches[2],
                    'message' => $matches[3],
                ];
            }
        }
        return $logData;
    }
}

