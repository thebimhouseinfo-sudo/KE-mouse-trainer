@echo off

REM Cài đặt các dependency
echo Cài đặt các dependency...
call npm install || (
    echo npm install thất bại. Vui lòng kiểm tra lỗi bên trên.
    pause
    exit /b 1
)

REM Khởi động máy chủ phát triển
echo Khởi động máy chủ phát triển...
start "Vite Development Server" cmd /k "npm run dev"

REM Chờ một chút để máy chủ khởi động
timeout /t 10 /nobreak > NUL

REM Mở trình duyệt
echo Mở trình duyệt...
start "" "http://localhost:3000"

pause
exit