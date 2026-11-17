@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup script for Windows, version 3.3.4
@REM
@REM Optional ENV vars
@REM   JAVA_HOME - location of a JDK home dir, if not set "java" must be in PATH
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM       set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@echo off
setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible wrapper scripters, use double underscores
set "__MVNW_ARG_0=%~0"
set "__MVNW_OUT_ERR_DIR=%TEMP%\mvnw-out-err-%RANDOM%"
mkdir "%__MVNW_OUT_ERR_DIR%"

@REM  Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM  Fallback to current directory if not found.

set "MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%"
if not "%MAVEN_PROJECTBASEDIR%"=="" goto endDetectBaseDir

set "EXEC_DIR=%CD%"
set "WDIR=%EXEC_DIR%"
:findBaseDir
if exist "%WDIR%\.mvn" (
  set "MAVEN_PROJECTBASEDIR=%WDIR%"
  goto endDetectBaseDir
)
set "WDIR=%WDIR%\.."
if exist "%WDIR%" goto findBaseDir

set "MAVEN_PROJECTBASEDIR=%EXEC_DIR%"

:endDetectBaseDir

if not exist "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties" (
  echo .mvn\wrapper\maven-wrapper.properties not found, can not start. >&2
  exit /b 1
)

@REM %1 contains the distributionUrl
for /f "tokens=2 delims==" %%i in ('findstr /l /c:"distributionUrl=" "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"') do (
  set "distributionUrl=%%i"
)

if "%distributionUrl%"=="" (
  echo distributionUrl not found in .mvn\wrapper\maven-wrapper.properties >&2
  exit /b 1
)

@REM  Check for "java.exe" in PATH or JAVA_HOME
if not "%JAVA_HOME%"=="" (
  set "JAVACMD=%JAVA_HOME%\bin\java.exe"
) else (
  set "JAVACMD=java.exe"
)

where /q "%JAVACMD%"
if %ERRORLEVEL% neq 0 (
  echo Error: JAVA_HOME is set to an invalid directory. >&2
  echo JAVA_HOME = "%JAVA_HOME%" >&2
  echo Please set the JAVA_HOME variable in your environment to match the >&2
  echo location of your Java installation. >&2
  exit /b 1
)

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"

if not exist "%WRAPPER_JAR%" (
  @REM  Download the wrapper jar if not present
  echo Couldn't find %WRAPPER_JAR%, downloading it ...
  @REM  This is a simplified version, real mvnw.cmd might have more logic for different downloaders
  powershell -Command "&{"^
    "$webclient = new-object System.Net.WebClient;"^
    "if (-not $webclient) { exit 1; }"^
    "$webclient.DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.4/maven-wrapper-3.3.4.jar', '%WRAPPER_JAR%');"^
  "}"
)

set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%"

"%JAVACMD%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "org.apache.maven.wrapper.MavenWrapperMain" %*

if ERRORLEVEL 1 set ERROR_CODE=1

exit /b %ERROR_CODE%
