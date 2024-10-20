#Use an official Node.js runtime as a parent image
FROM node:16

#Set the working directory to /workspace
WORKDIR /workspace

#Copy the current directory contents into the container at /workspace
COPY . /workspace

#Install app dependencies
RUN npm install

#Specify the command to run on container start
CMD ["node", "server/index.js"]