<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SalonOwnerController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| 1. GUEST (Khách vãng lai - Xem, tìm kiếm, AI, blog, tin mẫu tóc)
|--------------------------------------------------------------------------
*/
Route::controller(PublicController::class)->group(function () {
    Route::get('/', 'home')->name('home');
    Route::get('/salons', 'salons')->name('salons.index');
    Route::get('/salons/{id}', 'salonDetail')->name('salons.show');
    Route::get('/consultation', 'consultation')->name('consultation.index');
    Route::post('/consultation/ai', 'askAi')->name('consultation.ai');
    Route::get('/blogs', 'blogs')->name('blogs.index');
    Route::get('/blogs/{id}', 'blogDetail')->name('blogs.show');
    Route::get('/hair-models', 'hairModels')->name('hair-models.index');
});

/*
|--------------------------------------------------------------------------
| 2. XÁC THỰC (Auth: Đăng nhập, Đăng ký Customer, Đăng xuất)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->controller(AuthController::class)->group(function () {
    Route::get('/login', 'showLogin')->name('login');
    Route::post('/login', 'login')->name('login.post');
    Route::get('/register', 'showRegister')->name('register');
    Route::post('/register', 'register')->name('register.post');
});
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

/*
|--------------------------------------------------------------------------
| 3. CUSTOMER (Đã đăng nhập - Đặt lịch, quản lý đơn, đánh giá, ứng tuyển, profile)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->group(function () {
    // Luồng đặt lịch & quản lý lịch hẹn
    Route::get('/booking', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/my-bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/my-bookings/{id}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/my-bookings/{id}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // Đánh giá, ứng tuyển mẫu tóc, đóng góp blog & tài khoản cá nhân
    Route::controller(CustomerController::class)->group(function () {
        Route::post('/bookings/{id}/review', 'storeReview')->name('reviews.store');
        Route::post('/hair-models/{id}/apply', 'applyHairModel')->name('hair-models.apply');
        Route::post('/blogs/submit', 'submitBlog')->name('blogs.submit');
        Route::get('/profile', 'profile')->name('profile.index');
        Route::put('/profile', 'updateProfile')->name('profile.update');
        Route::put('/profile/password', 'updatePassword')->name('profile.password');
    });
});

/*
|--------------------------------------------------------------------------
| 4. SALON OWNER (Quản lý đúng salon_id của chủ tiệm)
|--------------------------------------------------------------------------
*/
Route::prefix('owner')->name('owner.')->middleware(['auth', 'role:salon_owner'])
    ->controller(SalonOwnerController::class)->group(function () {
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::put('/salon', 'updateSalon')->name('salon.update');
        Route::post('/services', 'storeService')->name('services.store');
        Route::put('/services/{id}', 'updateService')->name('services.update');
        Route::delete('/services/{id}', 'destroyService')->name('services.destroy');
        Route::post('/stylists', 'storeStylist')->name('stylists.store');
        Route::patch('/bookings/{id}/status', 'updateBookingStatus')->name('bookings.status');
        Route::post('/hair-models', 'storeHairModel')->name('hair-models.store');
    });

/*
|--------------------------------------------------------------------------
| 5. ADMIN (Quản trị & Kiểm duyệt toàn sàn)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin'])
    ->controller(AdminController::class)->group(function () {
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::patch('/users/{id}/toggle', 'toggleUser')->name('users.toggle');
        Route::patch('/salons/{id}/status', 'updateSalonStatus')->name('salons.status');
        Route::patch('/hair-models/{id}/status', 'moderateHairModel')->name('hair-models.status');
        Route::patch('/blogs/{id}/status', 'moderateBlog')->name('blogs.status');
        Route::delete('/reviews/{id}', 'destroyReview')->name('reviews.destroy');
    });