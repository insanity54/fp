# futureporn-next

## Dev notes

When adding a new module via pnpm, docker compose needs to be restarted or something. I'm not sure the exact steps just yet, but I think it's something like the following.

```
pnpm add @uppy/react
docker compose build next
```

> fp-next        | Module not found: Can't resolve '@uppy/react'

hmm... It looks like I'm missing something. Is the new package not getting into the container? Maybe it's something to do with the pnpm cache?

Must we build without cache?

    docker compose build --no-cache next; docker compose up

YES. that solved the issue.

However, it's really slow to purge cache and download all packages once again. Is there a way we can speed this up?

* make it work
* make it right
* make it fast

