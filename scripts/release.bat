@ECHO OFF
SETLOCAL EnableDelayedExpansion

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
bash.exe -lc github_changelog_generator || goto ERR
node scripts\make-release-note.js || goto ERR
git add CHANGELOG.md || goto ERR
git add RELEASE.md || goto ERR
git commit -m "update changelog [ci skip]" || goto ERR
git push || goto ERR

set RELEASE=%1
if "%RELEASE%"=="" set RELEASE=patch
npm version "%RELEASE%" || goto ERR
git push --follow-tags || goto ERR

goto END


:ERR
pause
exit 1

:END
