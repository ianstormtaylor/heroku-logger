
# heroku-logger

A dead simple logger, designed to be perfect for Heroku apps.

--

## Why?

There were lots of Node.js logging packages. There were simple ones that basically just print strings to the console, and there were complex ones like [Winston](https://github.com/winstonjs/winston) or [Bunyan](https://github.com/trentm/node-bunyan) which let you have fine-grained control over the where, what, and how of logging.

But none that were a one-liner for Heroku apps, with sane defaults.

Heroku already handles all of the logging issues that complex libraries solve—timestamping, process-stamping, log draining, performance, etc. So the complex libraries are just extra configuration for no gains.

But the one thing that no logger handled nicely was matching Heroku's [logfmt](https://brandur.org/logfmt) formatting out of the box. By using logfmt for your application logs, you get a consistent output for everything, so any consumers of the Heroku log drains can automatically parse them, because they're in the same format.

--

## Example

Given an API which is what you'd expect...

```js
import logger from 'heroku-logger'

logger.info('Starting server', { port: 4000 })

logger.error('Invalid `type` argument', { argument: 'type', value: 'nuber' })
```

In development, it will output an easy to read version...

```ini
[info] Starting server port=4000
[error] Invalid `type` argument argument=type value=nuber
```

But in production, will omit the extra junk, since Heroku handles that for you already, and simply output the data formatted as [`logfmt`]()...

```
[HEROKU LOGGING PREFIX HERE] port=4000
[HEROKU LOGGING PREFIX HERE] argument=type value=nuber
```

That's it!

--

## API

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
