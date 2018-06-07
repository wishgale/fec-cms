#!/bin/bash

# Set environment options to exit immediately if a non-zero status code
# appears from a command or within a pipe
set -o errexit
set -o pipefail

# Send out Slack notifications (off for now)
# invoke notify

cd fec
# Run migrations
./manage.py makemigrations 
./manage.py migrate wagtailadmin --noinput
./manage.py migrate wagtailcore --noinput
./manage.py migrate wagtaildocs --noinput
./manage.py migrate wagtailembeds --noinput
./manage.py migrate wagtailforms --noinput
./manage.py migrate wagtailimages --noinput
./manage.py migrate wagtailredirects --noinput
./manage.py migrate wagtailsearch --noinput
./manage.py migrate wagtailsearchpromotions --noinput
./manage.py migrate wagtailusers --noinput
./manage.py migrate --noinput

# Run application
gunicorn -k gevent -w 2 fec.wsgi:application
