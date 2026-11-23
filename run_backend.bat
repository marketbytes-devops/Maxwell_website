@echo off
echo ========================================================
echo Starting Maxsel Commercial Equipment Backend (FastAPI)...
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn app.main:app --reload --port 8000
pause
