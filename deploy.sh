sudo docker image build -t sss-v0 .
sudo docker container run -p 8000:8000 -d sss-v0
