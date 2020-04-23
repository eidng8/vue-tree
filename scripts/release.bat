@ECHO OFF
SETLOCAL EnableDelayedExpansion

set CWD=%cd%

cd /d "%~dp0"
cd ..

for /f %%t in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%t
if not "%BRANCH%"=="master" (
  echo You are not on master branch.
  goto ERR
)

git reset --hard --quiet || goto ERR
git clean -fdx --quiet || goto ERR
git pull || goto ERR

set RELEASE=%1
if "%RELEASE%"=="" set RELEASE=patch
call npm --no-git-tag-version version "%RELEASE%" || goto ERR

bash.exe -lc github_changelog_generator || goto ERR
for /f "tokens=*" %%v in ('node scripts\make-release-note.js') do set version=%%v
git add CHANGELOG.md || goto ERR
git add RELEASE.md || goto ERR
git commit -m "Release %VERSION%" || goto ERR
git tag -s --file=RELEASE.md "Release-v%VERSION%"
git push --follow-tags || goto ERR

goto END


:ERR
pause
cd "%CWD%"
exit 1

:END
cd "%CWD%"
