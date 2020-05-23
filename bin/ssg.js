#!/usr/bin/env node

'use strict';

process.title = 'ssg';

require('../lib/ssg')(process.argv.slice(2))