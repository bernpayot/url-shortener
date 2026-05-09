
# URL Shortener Backend Project

https://github.com/bernpayot/url-shortener
Check it out! https://acno.dev/

A backend project from Roadmap.sh. It's a RESTful API that allows users to shorten long URLS. Built this as a learning project to develop my backend fundamentals. I used AI as a mentor to guide me through architectural decisions and deepen my understanding of backend concepts.

### Notable Design decisions

302 vs 301 - I used a 302 Found/Temporary Redirect as the status code for my redirect endpoint. Since it was a Temporary Redirect, it meant that the browser didn't cache the short link aggressively, new requests can still hit the server. This is important because I am also tracking click counts for each short link (`access_count` field).

Redis server-side cache - I integrated Redis as a server-side cache so that while I still need the analytics checks in my server, Redis avoids hitting the database on every request. The request first checks if the short link is cached in Redis, if it is then it uses that.

Repository Layered Architecture - I have used this architecture quite a bit in some of my previous projects. Very powerful when it comes to separation of concerns (each layer is clear with its duties), data flexibility (you can change databases and it will still work), and it is easy to maintain.



## Tech Stack

- Typescript
- Node.js
- PostgreSQL
- Redis
- Docker
- EJS

## Getting Started

Make sure you have the following installed:
- Node.js
- npm
- Docker

### Installation

Clone the repository

```bash
  git clone https://github.com/bernpayot/url-shortener.git
  cd url-shortener
```

Set up the environment
- an .env.example is provided inside the project.
```bash
# Unix/Mac
cp .env.example .env
cp .env.example .env.docker

# Windows
copy .env.example .env
copy .env.example .env.docker
```

You will have to set up these environment variables manually.
```
PORT=
DB_HOST=
DB_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
REDIS_URL=
DATABASE_URL=
```
Start the Docker containers

```bash
docker-compose up --build
```

Run database migrations

```bash
npm run migrate:up
```

Verify if everything is working
- In your Postman/Terminal, you can verify if the project is working by testing the endpoints

```bash
curl -X POST http://localhost:3000/shorten -H "Content-Type: application/json" -d "{\"originalUrl\": \"https://www.google.com\"}"
```
then:

```bash
curl -v http://localhost:3000/{shortcode}
```

    
## API Documentation

#### Redirect URL

```json
  GET /${shortcode}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `shortcode` | `string` | **Required**. shortcode of link to redirect to original URL |

##### Response
*302 Found* -> Redirects to original URL


*404 Not Found*
```json
{
    "error": "Short URL with short code ${shortcode} was not found."   
}
```

#### Create a Short Link

```json
  POST /shorten/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `shortCode`      | `string` | Automatically generated using Nanoid |
| `originalUrl`      | `string` | **Required**. The original link that will be redirected to|

##### Request

```json
{
    "originalUrl": "https://example.com/some/very/long/url"    
}
```

##### Response
*201 Created*
```json
{
    "id": 1,
    "originalUrl": "https://example.com/some/very/long/url",
    "shortCode": "abc123",
    "accessCount": 0,
    "createdAt": "2026-05-07T10:00:00Z",
    "updatedAt": "2026-05-07T10:00:00Z"
}
```

*400 Bad Request*
```json
{
    "error": "Invalid URL"
}
```

#### Retrieve Short URL

```json
  GET /shorten/${shortcode}
```

##### Response
*200 OK*
```json
{
    "id": 1,
    "originalUrl": "https://example.com/some/very/long/url",
    "shortCode": "abc123",
    "accessCount": 0,
    "createdAt": "2026-05-07T10:00:00Z",
    "updatedAt": "2026-05-07T10:00:00Z"
}
```

*404 Not Found*
```json
{
    "error": "Shortcode was not found"   
}
```

#### Update Original URL

```json
  PUT /shorten/${shortcode}
```

##### Request
```json
{
    "originalUrl": "https://example.com/new-url"
}
```

##### Response
*200 OK*
```json
{
    "id": 1,
    "originalUrl": "https://example.com/new-url",
    "shortCode": "abc123",
    "accessCount": 0,
    "createdAt": "2026-05-07T10:00:00Z",
    "updatedAt": "2026-05-07T10:00:00Z"
}
```
*400 Bad Request*
```json
{
    "error": "Invalid URL"   
}
```

*404 Not Found*
```json
{
    "error": "Shortcode was not found"   
}
```

#### Delete Original URL

```json
  DELETE /shorten/${shortcode}
```

##### Response
*204 No Content (success)*

*404 Not Found*
```json
{
    "error": "Shortcode was not found"
}
```
