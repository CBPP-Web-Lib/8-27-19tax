GID=$(id -g)
cp -r .env_custom .env
echo "" >> .env
echo UID=${UID} >> .env
echo GID=${GID} >> .env
docker-compose run -u ${UID} --workdir "/opt/project/app" --entrypoint  "npm install" node-watch