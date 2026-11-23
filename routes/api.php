<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('user-registration', 'API\UserController@registration');
Route::post('user-login', 'API\UserController@login');
Route::post('verify-code', 'API\UserController@verifyVerificationCode');
Route::post('resend-code', 'API\UserController@ResendVerificationCode');
Route::post('forgot-password','API\UserController@forgotPassword');
Route::post('verify-otp','API\UserController@verifyOtp');
Route::post('resend-otp','API\UserController@resendOtp');
Route::post('change-password', 'API\UserController@changePassword');
Route::group(['middleware' => 'APIToken'], function () {
    Route::post('update-device-token', 'API\UserController@updateDeviceToken');
    Route::post('create-project-task', 'API\ProjectController@createProjectTask');
    Route::post('upload-document', 'API\ProjectController@addDocument');
    Route::post('project-list', 'API\ListController@projectList');
    Route::post('add-tag', 'API\ProjectController@addtag');
    Route::post('tag-list', 'API\ListController@taglist');
    Route::post('add-comment', 'API\ProjectController@addComment');
    Route::post('edit-comment', 'API\ProjectController@editComment');
    Route::post('delete-comment', 'API\ProjectController@deleteComment');
    Route::post('send-invitation', 'API\ProjectController@sendInvitation');
    Route::post('project-task-detail', 'API\ProjectController@projectTaskDetails');
    Route::post('project-task-member-list', 'API\ListController@projectTaskMemberList');
    Route::post('project-tag-list', 'API\ListController@projectTagList');
    Route::post('edit-tag', 'API\ProjectController@editTag');
    Route::post('delete-tag', 'API\ProjectController@deleteTag');
    Route::post('tasks-by-project-id', 'API\ListController@getTaskByProjectID');
    Route::post('tasks-by-flag', 'API\ListController@getTasksByFlag');
    Route::post('inbox-tasks', 'API\ListController@getInboxTasks');
    Route::post('update-duedate-time', 'API\ProjectController@updateDueDateTime');
    Route::post('update-reminder', 'API\ProjectController@updateReminder');
    Route::post('document-list-by-project-id','API\ListController@documentListByProjectId');
    Route::post('delete-document', 'API\ProjectController@deleteDocument');
    Route::post('comments-by-project-id', 'API\ListController@getCommentsByProjectId');
    Route::post('projects', 'API\ListController@getProjectsForAdd');
    Route::post('notification-list', 'API\ListController@getNotificationList');
    Route::post('user-details', 'API\UserController@getUserDetails');
    Route::post('update-user-details', 'API\UserController@updateUserDetails');
    Route::post('delete-project-task', 'API\ProjectController@deleteProjectTask');
    Route::post('update-notification-setting', 'API\UserController@updateNotificationSetting');
    Route::post('update-timezone', 'API\UserController@updateTimezone');
    Route::post('update-project', 'API\ProjectController@updateProject');
    Route::post('update-task', 'API\ProjectController@updateTask');
    Route::post('mark-as-read', 'API\ProjectController@markAsReadNotification');
    Route::post('update-default-reminder', 'API\UserController@updateDefaultReminder');
    Route::post('update-remind-via', 'API\UserController@updateRemindVia');
    Route::post('update-remind-via', 'API\UserController@updateRemindVia');
    Route::post('complete-uncomplete-task', 'API\ProjectController@completeTask');
    Route::post('send-to-review', 'API\ProjectController@sendToReview');
    Route::post('review-project-list', 'API\ListController@getUnderReviewProjects');
    Route::post('search-list', 'API\ListController@searchProjectTask');
    Route::post('associated-member-list', 'API\ListController@associatedMemberList');
    Route::post('assign-member-task', 'API\ProjectController@assignMemberTask');
    Route::post('complete-project', 'API\ProjectController@completeProject');
    Route::post('update-priority', 'API\ProjectController@updatePriority');
    Route::post('project-task-by-tag', 'API\ListController@getProjectTaskByTag');
    Route::post('delete-account', 'API\ProjectController@deleteAccount');
    Route::post('notification-count', 'API\ListController@getNotificationCount');
    Route::post('move-task', 'API\ProjectController@moveTaskToParent');
});
