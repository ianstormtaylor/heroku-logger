
# heroku-logger

A dead simple logger, designed to be perfect for Heroku apps.

---

### Features

- It's a one-liner, because it's super simple.
- Has sane defaults based on your `NODE_ENV` and `LOG_LEVEL` environment variables.
- Matches Heroku's [logfmt](https://brandur.org/logfmt) formatting syntax.
- Makes logs easy to read in development.
- Makes logs match Heroku's own logs in production.

---

### Why?

There are lots of Node.js logging packages—simple ones that basically just print strings to the console, and complex ones like [Winston](https://github.com/winstonjs/winston) or [Bunyan](https://github.com/trentm/node-bunyan) which give you fine-grained control.

But none that were a one-liner for Heroku apps, with sane defaults.

Heroku already handles all of the logging issues that complex libraries solve—timestamping, process-stamping, log draining, performance, etc. So the complex libraries are just extra configuration for no gains.

But the one thing that no logger handled nicely was matching Heroku's [logfmt](https://brandur.org/logfmt) formatting out of the box. By using logfmt for your application logs, you get a consistent output for everything, so any consumers of the Heroku log drains can automatically parse them, because they're in the same format.

---

### Example

Given an API which is what you'd expect...

```js
import logger from 'heroku-logger'

logger.info('Starting server', { port: 4000 })
logger.error('Invalid `type` argument', { argument: 'type', value: 'nuber' })
```

In development, it outputs an easy to read version...

```ini
[info] Starting server port=4000 level=info message="Starting server"
[error] Invalid `type` argument argument=type value=nuber level=error message="Invalid `type` argument"
```

But in production, it omits the junk, since Heroku handles that for you, and simply outputs the data in [`logfmt`]()...

```
2017-04-12T05:42:20.998389+00:00 app[web.1]: port=4000 level=info message="Starting server"
2017-04-12T05:42:20.998389+00:00 app[web.1]: argument=type value=nuber level=error message="Invalid `type` argument"
```

That's it!

---

### API

```js
import logger from 'heroku-logger'
import { Logger } from 'heroku-logger'
```

The package exports the one-liner `logger` singleton as the default, which is already instanciated with sane defaults using the `LOG_LEVEL` and `NODE_ENV` environment variables.

But if you need to create multiple instances, the `Logger` constructor is also exported.

```js
const logger = new Logger({
  level: String,     // Defaults to `LOG_LEVEL` if set, or 'info'.
  color: Boolean,    // Defaults to `true` only if `NODE=ENV != 'production'`.
  readable: Boolean, // Defaults to `true` only if `NODE=ENV != 'production'`.
})
```

- `level` sets the current log threshold, silencing logs that don't meet it.
- `color` sets whether to log in colors, for easier scanning.
- `readable` sets whether to log the `message` separate from the `data`

The following levels are available:

```
logger.trace
logger.debug
logger.info
logger.warn
logger.error
logger.fatal
```
