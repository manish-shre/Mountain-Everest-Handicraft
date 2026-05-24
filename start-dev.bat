@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
)
echo Starting dev server...
call npm run dev
pause
