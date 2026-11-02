# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).

## Pages API for PHP frontends

Payload exposes the Pages collection through its REST API. Replace `https://cms.example.com` with the deployed admin-panel origin. Page reads are public; creating, updating, and deleting pages still require authentication.

Fetch a page by ID:

```text
GET https://cms.example.com/api/pages/{id}?depth=2
```

Fetch a page by its generated slug:

```text
GET https://cms.example.com/api/pages?where[slug][equals]={slug}&limit=1&depth=2
```

The ID route returns the page document directly. The slug query returns a paginated response; the matching page is in `docs[0]`. `depth=2` populates related media and nested block data. Without a matching slug, `docs` is empty.

Example PHP helper that fetches by slug:

```php
<?php
function getPageBySlug(string $cmsBaseUrl, string $slug): ?array
{
    $query = http_build_query([
        'where' => ['slug' => ['equals' => $slug]],
        'limit' => 1,
        'depth' => 2,
    ]);
    $url = rtrim($cmsBaseUrl, '/') . '/api/pages?' . $query;
    $curl = curl_init($url);

    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);

    $body = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    if ($body === false) {
        throw new RuntimeException('Could not connect to the CMS: ' . $error);
    }
    if ($status < 200 || $status >= 300) {
        throw new RuntimeException('CMS returned HTTP ' . $status);
    }

    $result = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    return $result['docs'][0] ?? null;
}

$page = getPageBySlug('https://cms.example.com', 'about-us');
```

The API response includes fields such as `title`, `slug`, `description`, `content`, and `sections`. Uploaded media includes its URL; if the CMS returns a relative URL, prefix it with the CMS origin when rendering it on the PHP site.
