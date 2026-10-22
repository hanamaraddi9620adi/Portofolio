@echo off
cd /d "%~dp0"
set NEXT_PUBLIC_SITE_URL=http://localhost:3100
echo Opening the portfolio at http://localhost:3100
echo Keep this window open. Press Ctrl+C to stop.
call npm.cmd run dev -- --port 3100
