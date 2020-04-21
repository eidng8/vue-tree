@ECHO OFF
SETLOCAL EnableDelayedExpansion

cd /d "%~dp0"
cd ..

for /f %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
if not "%BRANCH%"=="master" (
  echo You are not on master branch.
  goto ERR
)

git reset --hard --quiet
git pull
bash.exe -lc github_changelog_generator
git add CHANGELOG.md
git commit -m "update changelog [ci skip]"
git push

set RELEASE=%1
if "%RELEASE%"=="" set RELEASE=patch
npm version "%RELEASE%"
git push --follow-tags

goto END


:ERR
pause
exit 1

:END
