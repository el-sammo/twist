/**
 * Bunyan logger configuration.
 *
 * @see https://github.com/trentm/node-bunyan
 */
module.exports = {
  // Name field present in all lines of logging
  name: 'HTTP Domain Proxy',

  // Logging level.  The following lists valid logging levels as provided
  // by the node-bunyan documentation.
  //
  // "fatal" (60): The service/app is going to stop or become unusable
  //               now. An operator should definitely look into this soon.
  // "error" (50): Fatal for a particular request, but the service/app
  //               continues servicing other requests. An operator
  //               should look at this soon(ish).
  // "warn" (40):  A note on something that should probably be looked at
  //               by an operator eventually.
  // "info" (30):  Detail on regular operation.
  // "debug" (20): Anything else, i.e. too verbose to be included in
  //               "info" level.
  // "trace" (10): Logging from external libraries used by your app or
  //               very detailed application logging.
  //
  // Suggestions: Use "debug" sparingly. Information that will be useful
  // to debug errors post mortem should usually be included in "info"
  // messages if it's generally relevant or else with the corresponding
  // "error" event. Don't rely on spewing mostly irrelevant debug
  // messages all the time and sifting through them when an error occurs.
  level: 'trace',

  // Default stream for logs to go to
  stream: process.stdout,

  // Uncomment and customize to send different log levels to different
  // destinations (stdout, files, etc).
  /**********************************************************************
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      path: './logs/error.log'
    },
  ],
  **********************************************************************/

  // Uncomment and customize to change what is logged (and how logs are
  // serialized).
  /**********************************************************************
  serializers: {
    ...
  },
  **********************************************************************/

  // Uncomment to include the source file, line, and function of the log
  // call site.
  //
  // WARNING: Determining the call source info is slow. Never use this
  // option in production.
  /**********************************************************************
  src: true,
  **********************************************************************/
};

