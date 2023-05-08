# docker-overdrive

[![MIT license][license image]][license link]
[![Build Status][build image]][build link]
[![GitHub release][github image]][github link]

Docker package for running & downloading files from Overdrive via bash script.

Assuming the environment variables `DESTINATION_FOLDER` and `SOURCE_FOLDER`
are set, the Overdrive script can be run via a help script that only requires
the filename (with extension). E.g.:

```sh
run-overdrive download Novel.odm
```

The script will read `Novel.odm` from the set `SOURCE_FOLDER` and download
to `DESTINATION_FOLDER`.

Any of the underlying commands for the Overdrive script will work with the
helper script:

* `download`
* `return`
* `info`
* `metadata`

If needed, debugging can be done by adding the `--verbose` flag and retrying:

```sh
download Novel.odm --verbose
```

For more information on the script, see: [https://github.com/chbrown/overdrive](https://github.com/chbrown/overdrive),
in particular [Common errors](https://github.com/chbrown/overdrive#common-errors).

[license image]: https://img.shields.io/badge/License-MIT-blue.svg
[license link]: https://github.com/gtronset/docker-overdrive/blob/main/LICENSE
[build image]: https://github.com/gtronset/docker-overdrive/actions/workflows/build-release.yaml/badge.svg
[build link]: https://github.com/gtronset/docker-overdrive/actions/workflows/build-release.yaml
[github image]: https://img.shields.io/github/release/gtronset/docker-overdrive.svg
[github link]: https://github.com/gtronset/docker-overdrive/releases
