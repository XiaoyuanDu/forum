FROM python:3.8.16-bullseye
RUN apt-get update && apt-get install -y git
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN --mount=type=ssh pip3 install -r requirements.txt
COPY . .
RUN python manage.py makemigrations
RUN python manage.py migrate
CMD ["daphne", "technota_api.asgi:application", "-b", "0.0.0.0"]