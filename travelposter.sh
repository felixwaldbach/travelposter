#!/bin/sh

forever start /usr/app/bin/www

nginx -g 'daemon off;'
