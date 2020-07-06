# Execute the command in Docker Container.
# Dockerコンテナの内部でコマンドを実行します.
# option: attachを第1引数に指定すると、docker-compose up で立ち上がっているコンテナ内で実行します.
#         デフォルトでは一時的にコンテナを立てて実行します.
EXEC_CMD=''

ATTACH_CMD='docker exec -it 20fresh_f_front_app_1'
UPP_CMD='docker-compose run --rm app sh -c'
DOCKER_CMD=${UPP_CMD}
if [ $1 = 'attach' ]; then
  DOCKER_CMD=${ATTACH_CMD}
  shift
fi

while [ "$1" != "" ]
do
  EXEC_CMD="${EXEC_CMD} $1"
  shift
done

echo ${DOCKER_CMD} "${EXEC_CMD}"
${DOCKER_CMD} "${EXEC_CMD}"
