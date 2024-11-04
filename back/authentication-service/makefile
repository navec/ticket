# Name of docker image
IMAGE_NAME=authentication-service

# Name of docker container
CONTAINER_NAME=authentication-container

# Build your docker image
build:
	docker build --no-cache -t $(IMAGE_NAME) .

# Run docker container
run:
	docker run -d --name $(CONTAINER_NAME) -p 3000:3000 --env-file .env $(IMAGE_NAME)

# Stop docker container
stop:
	docker stop $(CONTAINER_NAME)

# Delete docker container
rm:
	docker rm $(CONTAINER_NAME)

# Delete docker image
rmi:
	docker rmi $(IMAGE_NAME)

# Restart docker container
restart: stop rm build run

# Display logs of docker container
logs:
	docker logs -f $(CONTAINER_NAME)
