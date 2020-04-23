@ECHO OFF
SETLOCAL EnableDelayedExpansion

set CWD=%cd%

cd /d "%~dp0"
cd ..

for /f %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
if not "%BRANCH%"=="master" (
  echo You are not on master branch.
  goto ERR
)

git reset --hard --quiet || goto ERR
git clean -fdx --quiet || goto ERR
git pull || goto ERR

set RELEASE=%1
if "%RELEASE%"=="" set RELEASE=patch
npm --no-git-tag-version version "%RELEASE%" || goto ERR

bash.exe -lc github_changelog_generator || goto ERR
FOR /F "tokens=*" %%F IN ('node scripts\make-release-note.js') DO SET VERSION=%%F
git add CHANGELOG.md || goto ERR
git add RELEASE.md || goto ERR
git commit -m "Release %VERSION%" || goto ERR
git tag -s --file=RELEASE.md "%VERSION%"
git push --follow-tags || goto ERR

goto END


:ERR
pause
cd "%CWD%"
exit 1

:END
cd "%CWD%"
