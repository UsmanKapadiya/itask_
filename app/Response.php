<?php

namespace App;

use Symfony\Component\HttpFoundation\Response as HttpResponse;

class Response
{
    public const HTTP_INTERNAL_SERVER_ERROR = HttpResponse::HTTP_INTERNAL_SERVER_ERROR;

    public static function prepareResponseOk($data = [])
    {
        if (is_array($data) && (array_key_exists('ResponseCode', $data) || array_key_exists('status', $data) || array_key_exists('success', $data))) {
            return $data;
        }

        return [
            'ResponseCode' => 1,
            'ResponseText' => 'Success',
            'data' => $data,
        ];
    }

    public static function prepareErrorResponse($errors, $status = self::HTTP_INTERNAL_SERVER_ERROR)
    {
        $message = $errors;
        if (is_array($errors)) {
            $first = reset($errors);
            if (is_array($first)) {
                $first = reset($first);
            }
            $message = is_string($first) ? $first : 'Error';
        }

        return [
            'ResponseCode' => 0,
            'ResponseText' => is_string($message) ? $message : 'Error',
            'errors' => $errors,
            'status' => $status,
        ];
    }
}
