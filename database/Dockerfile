  
FROM mariadb:latest 

# Install extra system packages
RUN curl -sL https://deb.nodesource.com/setup | bash - && \
    apt-get update && \
    apt-get install --no-install-recommends -y \
        unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
    
ADD db-scripts/ /db-scripts/

WORKDIR /db-scripts

ADD container-files/ /
RUN chmod 700 /init-databases.sh 
