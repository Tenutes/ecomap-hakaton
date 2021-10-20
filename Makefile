COMPOSE=docker-compose -f docker-compose.yml

build:
	${COMPOSE} build
up:
	${COMPOSE} up
reload:
	${COMPOSE} stop
	${COMPOSE} up -d
