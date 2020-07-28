---
layout: post
title: Using HTTPie with mkcert
date: 2020-07-28 12:03 +0200
---

## Using HTTPie with mkcert

In order to get the development environment on `localhost` closer to the production environment, I'm using HTTPS on `localhost`. This helps me with discovering bugs much earlier, which saves a lot of time.

I use the [excellent tool `mkcert`](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/) for managing the certificates locally. `mkcert` is built exactly for this purpose and removes most of the friction.

I regularly use [`httpie`](https://httpie.org) to interact with HTTP servers.

However, `httpie` doesn't know about about the certificate authority installed locally by `mkcert`, so we'll have to help it a bit.

```sh
http --verify="$(mkcert --CAROOT)/rootCA.pem" https://localhost.myapp.org:8443/some/path
```

Since I don't want to type that on every invocation, I've added it as an alias in `.bash_profile`.

```sh
alias http="http --verify=\"$(mkcert --CAROOT)/rootCA.pem\""
```

And then I can use `httpie` as normal

```sh
http https://localhost.myapp.org:8443/some/path
```
