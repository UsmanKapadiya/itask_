<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::user()) {
        return redirect('dashboard');
    } else {
        return view('auth.login');
    }
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
});
Route::get('/verify-code/{email}', 'HomeController@loadVerifyCode');
Route::post('/user-register', 'HomeController@register');
Route::post('/verify-code', 'HomeController@verifyCode');
Route::post('/resend-code', 'HomeController@resendCode');
Route::post('/user-login', 'HomeController@vefiryLogin');
Route::get('/password-reset', function () {
    return view('auth.passwords.email');
});
Route::post('/password-reset', 'HomeController@forgotPassword')->name("password-reset");
Route::get('/password-reset/{email}', 'HomeController@loadOTPView');
Route::get('/change-password/{email}', 'HomeController@loadChangePassword');
Route::post('/change-password', 'HomeController@changePassword')->name("change-password");
Route::post('/verify-otp', 'HomeController@verifyOtp')->name("verify-otp");
Route::get('/resend-otp/{email}', 'HomeController@resendOtp');
Route::get('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/send-notification','ProjectController@sendCreateNotification')->name('send-notification');
Route::group(['middleware' => ['auth']], function () {
    Route::get('/dashboard', function () {
        return view('projectdetail');
    });
    Route::get('/home', 'HomeController@index')->name('home');
    Route::post('/search-list', 'ListController@searchList');
    Route::get('/notification-list', 'ListController@notificationList');
    Route::post('/read-notification', 'HomeController@readNotification');
    Route::get('/member-information', 'HomeController@memberInformation');
    Route::post('/user-update', 'HomeController@userUpdate');
    Route::post('/update-timezone', 'HomeController@timezoneUpdate');
    Route::get('/member-notification-information', 'HomeController@memberNotificationInformation');
    Route::post('/update-via-notification', 'HomeController@vianotificationUpdate');
    Route::post('/update-auto-reminder', 'HomeController@autoreminderUpdate');
    Route::get('/notification-information', 'HomeController@notificationInformation');
    Route::post('/update-notification-setting', 'HomeController@notificationsettingUpdate');
    Route::post('/projects', 'ListController@projectList');
    Route::get('/projects', 'ListController@projectList');
    Route::get('member-to-assign/{projectId}', 'ListController@memberDetail');
    Route::post('/unassign-task', 'ListController@unassignTaskList');
    Route::get('/unassign-task', 'ListController@unassignTaskList');
    Route::get('/inbox-task-count', 'ListController@inboxTasksCount');
    Route::post('/member-projects', 'ListController@parentProjects');
    Route::get('/members-list/{project_id}', 'ListController@membersList');
    Route::get('/member-tags', 'ListController@memberTags');
    Route::post('/review-project', 'ListController@reviewProjectList');

    Route::post('/project-detail-list', 'ListController@projectDetailList');
    Route::get('/member-detail-list/{projectid}', 'ListController@memberDetailList');

    Route::get('/unassign-members-list/{projectid}', 'ListController@unassignMemberDetailList');

    Route::get('/comment-detail-list/{ptid}', 'ListController@commentDetailList');
    Route::get('/attachment-detail-list/{projectid}', 'ListController@attachmentDetailList');

    Route::post('/list-by-flag', 'ListController@listByFlag');
    Route::post('/add-project', 'ProjectController@addProjectTask');
    Route::post('/invite-member', 'ProjectController@inviteMember');
    Route::post('/add-task', 'ProjectController@addProjectTask');
    Route::post('/save-update-task', 'ProjectController@updateTask');
    Route::post('/add-comment', 'ProjectController@addComment');
    Route::post('/save-update-comment', 'ProjectController@updateComment');
    Route::post('/delete-comment', 'ProjectController@deleteComment');
    Route::post('/remove-member', 'ProjectController@removeMember');
    Route::post('/delete-attachment', 'ProjectController@deleteDocument');
    Route::post('/delete-multiple-attachment', 'ProjectController@deleteMultipleDocument');
    Route::post('/update-attachment', 'ProjectController@updateAttachment');
    Route::post('/add-tag', 'ProjectController@addTag');
    Route::post('/edit-tag', 'ProjectController@editTag');
    Route::post('/delete-tag', 'ProjectController@deleteTag');
    Route::post('/delete-project-task', 'ProjectController@deleteProjectTask');
    Route::get('/notification-count', 'ListController@getNotificationCount');
    Route::post('/project-detail-by-id', 'ProjectController@getProjectDetails');
    Route::post('/update-project', 'ProjectController@updateProject');
    Route::post('/complete-uncomplete-task', 'ProjectController@completeTask');
    Route::post('/complete-project', 'ProjectController@completeProject');
    Route::post('/assign-member-task', 'ProjectController@assignMemberTask');
    Route::post('/project-task-by-tag', 'ListController@getProjectTaskByTag');
    Route::post('/delete-user', 'ProjectController@deleteAccount');
    Route::post('/move-task-project', 'ProjectController@moveTaskProject');
});

