#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Apache Maven Wrapper startup script for Unix, version 3.3.4
#
# Optional ENV vars
# ----------------------------------------------------------------------------

set -e

# Find the project base dir, i.e. the directory that contains the folder ".mvn".
# Fallback to current directory if not found.

dir="$(cd "$(dirname "$0")" && pwd)"
while [ "$dir" != "/" ]; do
  if [ -d "$dir/.mvn" ]; then
    MAVEN_PROJECTBASEDIR="$dir"
    break
  fi
  dir="$(dirname "$dir")"
done
[ -z "$MAVEN_PROJECTBASEDIR" ] && MAVEN_PROJECTBASEDIR="$(pwd)"

export MAVEN_PROJECTBASEDIR

WRAPPER_JAR="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar"
WRAPPER_PROPERTIES="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.properties"

if [ ! -f "$WRAPPER_PROPERTIES" ]; then
  echo ".mvn/wrapper/maven-wrapper.properties not found, can not start." >&2
  exit 1
fi

distributionUrl=$(grep "^distributionUrl=" "$WRAPPER_PROPERTIES" | cut -d'=' -f2-)

if [ -z "$distributionUrl" ]; then
  echo "distributionUrl not found in .mvn/wrapper/maven-wrapper.properties" >&2
  exit 1
fi

if [ -n "$JAVA_HOME" ]; then
  JAVACMD="$JAVA_HOME/bin/java"
else
  JAVACMD="java"
fi

if [ ! -f "$WRAPPER_JAR" ]; then
  echo "Couldn't find $WRAPPER_JAR, downloading it ..."
  # Use curl or wget
  if command -v curl >/dev/null 2>&1; then
    curl -sSL "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.4/maven-wrapper-3.3.4.jar" -o "$WRAPPER_JAR"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.4/maven-wrapper-3.3.4.jar" -O "$WRAPPER_JAR"
  else
    echo "Error: curl or wget not found." >&2
    exit 1
  fi
fi

exec "$JAVACMD" $MAVEN_OPTS -classpath "$WRAPPER_JAR" "org.apache.maven.wrapper.MavenWrapperMain" "$@"
