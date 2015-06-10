export default  {
  "env-configs": {
    "default-name": "default",
    "dir": "configs",
    "cli-arg": "conf",
  },

  "webpack": {
    "port": 9001,
    "host": "localhost",
    "livereload": 35729,
    "quiet": true,
    "noInfo": true,
    "lazy": false,
    "watchDelay": true,
    "headers": {
      "X-Custom-Header": "yes"
    },
    "stats": {
      "colors": true
    }
  }
}
