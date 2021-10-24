COMPOSE=docker-compose -f docker-compose.yml

build:
	${COMPOSE} build
rebuild:
	${COMPOSE} build
up:
	${COMPOSE} up
daemon:
	${COMPOSE} up -d
reload:
	${COMPOSE} stop
	${COMPOSE} up -d
