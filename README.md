
# Shorten URL App

Docker APP to short URL and save it locally, you can redirect to the orginal url by entering the shortUrl in search bar, when APP is running.


## Run Locally

Docker Build

```bash
  docker-compose build
```

Docker Up

```bash
  docker-compose up
```


## API Reference

#### Frontend URL

```http
  http://localhost:3000/
```

#### Get shorten url

```http
  GET api/shorten
```

#### Get original url from shorten code

```http
  GET /:shortCode
```
