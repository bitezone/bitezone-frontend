docker stop bitezone-frontend-service
docker rm bitezone-frontend-service
docker build -t bitezone-frontend .
docker run  -p 7777:3000 --name bitezone-frontend-service bitezone-frontend