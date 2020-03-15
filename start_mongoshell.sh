#! /bin/sh
IP="$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongo_yelpcamp)" 
docker exec -it mongo_yelpcamp mongo --host "$IP:27018"
