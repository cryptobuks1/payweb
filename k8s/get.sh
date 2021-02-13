#!/bin/sh
USERNAME=lakshmoji
REGISTRY=gitlab 
SECRET_NAME=${REGISTRY}-registry
EMAIL=lakshmoji@zelarsoft.com
GITLAB_TOKEN="Kn-HV3-_2PnN495bGkgP"
echo "ENV variables setup done."
echo $GITLAB_TOKEN
kubectl delete secret --ignore-not-found $SECRET_NAME
kubectl create secret docker-registry gitlab-registry \
--docker-server=https://registry.gitlab.com \
--docker-username=$USERNAME \
--docker-password=$GITLAB_TOKEN \
--docker-email=$EMAIL
echo "Secret created by name. $SECRET_NAME"
kubectl patch serviceaccount default -p '{"imagePullSecrets":[{"name":"'$SECRET_NAME'"}]}'
echo "All done."
