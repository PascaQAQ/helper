# HUT helper for wechat

- Simple and quick

## Publish Images to Server

```bash
rsync -av helper/img/ tony@172.16.10.210:~/html/uploads/huthelper/img
```

## Build

```bash
# Build and analyze both server and browser
BUNDLE_ANALYZE=browser npm run build

# Build and and analyze neither server nor browser
npm run build
```

## Config

```bash
http {
    sendfile           on;
    tcp_nopush         on;
    tcp_nodelay        on;

    client_max_body_size 10m;

    upstream http_api {
        server    127.0.0.1:3010;
        keepalive 16;
    }

    server {
        server_name _;
        rewrite     / https://huthelper.cn;
    }

    server {
        listen 443 ssl http2 fastopen=3 reuseport;

        ssl on;
        ssl_certificate "/etc/nginx/ssl/1_wx.huthelper.cn_bundle.crt";
        ssl_certificate_key "/etc/nginx/ssl/2_wx.huthelper.cn.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;

        ssl_session_cache        shared:SSL:10m;
        ssl_session_timeout      60m;

        ssl_session_tickets      on;

        ssl_stapling             on;
        ssl_stapling_verify      on;
        ssl_trusted_certificate  /xxx/full_chain.crt;

        resolver                 8.8.4.4 8.8.8.8 valid=300s;
        resolver_timeout         10s;

        location ^~ /_next {
            proxy_pass          http://http_api;
            proxy_hide_header   X-Powered-By;
            proxy_set_header    Host $http_host;
            proxy_set_header    Connection "";
            proxy_http_version  1.1;
        }

        location ~* \.(ico|png|jpg|jpeg|webp|gif|css|js|doc|docx|ppt|pptx|xls|xlsx|pdf|zip|rar|txt|json|manifest)$ {
            root /var/www/html/wechat/static;
        }

        location ^~ /static {
            alias /var/www/html/wechat/static/;
        }

        # hmr
        location /webpack-hmr {
            proxy_pass         http://wx;
            proxy_http_version 1.1;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
        }

        location /
        {
            root  /var/www/html/wechat/helper;
            proxy_pass          http://http_api;
            proxy_hide_header   X-Powered-By;
            proxy_set_header    Host $http_host;
            proxy_redirect      off;
            proxy_set_header    Connection "";
            proxy_http_version  1.1;
         }
    }
}
```

mime.types:

```bash
text/cache-manifest                   manifest;
```

manifest:

```bash
CACHE MANIFEST
# 201804 79zxCEFzzzxaizxc

CACHE:
# only root page

NETWORK:
*

```

## Todo

- nav and back/refresh

