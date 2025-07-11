@echo off

echo Starting backend development server...
start cmd /k "cd backend && npm run dev"

echo Starting frontend development server...
start cmd /k "cd frontend && npm run dev"


echo Development servers started in separate windows.
echo You can close this window.
