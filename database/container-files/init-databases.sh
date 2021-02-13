#!/bin/bash

RET=1
echo $RET
while [ RET -ne 0 ]; do
    echo "=> Waiting for confirmation of MariaDB service startup"
    sleep 5
    mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "status" > /dev/null 2>&1
    RET=$?
done
echo $INSTALL_PAYVOO
echo "Checking for databases to import from environment variables INSTALL_<DB_NAME>";
if [ -n "$INSTALL_PAYVOO" ]; then
    mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE payvoo2"
    mysql -uroot -p${MYSQL_ROOT_PASSWORD} payvoo2 < v0.1/db_script.sql
    mysql -uroot -p${MYSQL_ROOT_PASSWORD} payvoo2 < v0.2/db_script.sql
fi


echo "=> Granting access to all databases for '${MYSQL_USER}'"
mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER '${MYSQL_USER}'@'%' IDENTIFIED BY '{$MYSQL_PASSWORD}'"
mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%' WITH GRANT OPTION"

echo "=> Done!"