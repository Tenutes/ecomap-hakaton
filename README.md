# ecomap-hakaton

## Требования
- node v14+

## Deploy
1. создать `.env` файл и заполнить его по примеру `.env-example`
   1. Ссылка на машину где развернут API + указать порт `:8080` : `VUE_APP_ROOT_API="http://[IP]:8008"`
2. исполнить команду `make build` и дождаться ее заверщения
3. исполнить команду `make daemon` и дождаться ее заверщения
4. Фронт доступен для использования

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
