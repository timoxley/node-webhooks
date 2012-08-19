node-webhooks
=============

## Easily Create Webhooks

1. Create a script called `webhook` in the directory you wish to
   run it from.
2. Run `webhooks` command in same directory as `webhook` script to
   get the webhook key.
3. Boot webhooks with `webhooks start`
4. POST to your webhooks server using your webhook key, e.g.
   curl -d '' http://localhost:10010/CrfYl8CssJ7Jo0dYryVJYMV44CC5AcLi0At%2FF0DXa5TTiSQs%3D

### Security

Use this with much caution. I wouldn't use this on a production
machine. For increased security, set an environment var
WH_SECRET=mysecret when running `webhook` or `webhook start` to encrypt
using a custom keyphrase.
