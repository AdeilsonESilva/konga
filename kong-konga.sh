#!/bin/bash

# Script variables, change this for your use case
DB_HOST="localhost"
DB_PORT=5432
DB_USERNAME="postgres"
DB_PASSWORD="kong"
# DB_KONG_NAME="kong"
DB_KONGA_NAME="postgres"
# S3_KONG_PLUGIN_BUCKET="pecachevrolet.kong.plugins"
# SYSTEM_GROUP="5df7ce0f232e114b072af74a" #JumpCloud System Group ID
# INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id)
# API_KEY="93d04bdfae226ae7a5496f5779c53dbe850f594f" #JumpCloud API KEY

# # Enable login with LDAP user/pass
# sudo sed -i '/PasswordAuthentication no/c\PasswordAuthentication yes' /etc/ssh/sshd_config

# # Configure JumpCloud
# curl --tlsv1.2 --silent --show-error --header 'x-connect-key: 8c9e7531723569c4bd343f3348c63179095c90c2' https://kickstart.jumpcloud.com/Kickstart | sudo bash

# # Update Linux / Prepare for install
# sudo apt-get update
# sudo apt-get install -y git openssl libpcre3 procps perl apt-transport-https curl lsb-core vim jq tcpdump zip unzip zlib1g-dev
# sudo apt install -y awscli

# # Install Kong
# sudo curl -Lo kong.2.4.1.amd64.deb "https://download.konghq.com/gateway-2.x-ubuntu-$(lsb_release -cs)/pool/all/k/kong/kong_2.4.1_amd64.deb"
# sudo dpkg -i kong.2.4.1.amd64.deb
# sudo rm -rf kong.2.4.1.amd64.deb

# # Configure Kong
# echo "log_level = info
# admin_listen = 0.0.0.0:8001
# vitals = on
# portal = on
# database = postgres
# pg_host = $DB_HOST
# pg_user = $DB_USERNAME
# pg_database = $DB_KONG_NAME
# pg_password = $DB_PASSWORD
# plugins = bundled, brainweb-jwt-plugin" | sudo tee -a /etc/kong/kong.conf
# aws s3 cp s3://$S3_KONG_PLUGIN_BUCKET/brainweb-jwt-plugin-1.1-0.all.rock /home/ubuntu/
# sudo luarocks install /home/ubuntu/brainweb-jwt-plugin-1.1-0.all.rock
# sudo mv /home/ubuntu/brainweb-jwt-plugin-1.1-0.all.rock /etc/kong/
# sudo kong migrations bootstrap [-c /etc/kong/kong.conf]
# ulimit -n 4096
# sudo systemctl daemon-reload
# sudo systemctl enable kong.service
# sudo service kong start

# # Install Node
# curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash
# sudo apt-get install -y nodejs

# # Install Konga
# curl --show-error --location https://github.com/pantsel/konga/archive/refs/heads/master.zip --create-dirs -o /home/ubuntu/konga.zip
# sudo unzip -o /home/ubuntu/konga.zip -d /home/ubuntu/
# mv /home/ubuntu/konga-master /home/ubuntu/konga
# chmod -R 777 .
# sudo rm /home/ubuntu/konga.zip

# cd /home/adeilsonsilva/workspace/lixo/konga
# npm i --ensure

# Configure Konga
# echo "PORT=1337
# NODE_ENV=production
# KONGA_HOOK_TIMEOUT=120000
# DB_ADAPTER=postgres
# DB_HOST=$DB_HOST
# DB_PORT=$DB_PORT
# DB_USER=$DB_USERNAME
# DB_DATABASE=$DB_KONGA_NAME
# DB_PASSWORD=$DB_PASSWORD
# KONGA_LOG_LEVEL=warn
# TOKEN_SECRET=i6Xb4bGL0iJCno8hbrlAZ9" | sudo tee -a /home/adeilsonsilva/workspace/lixo/konga/.env
PARAMS="prepare --adapter postgres --uri postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_KONGA_NAME"
echo $PARAMS
node --trace-warnings ./bin/konga.js  prepare --adapter postgres --uri postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_KONGA_NAME

# # Configure Konga as a service
# echo "#!/bin/bash
# sudo npm run production" | sudo tee -a /home/ubuntu/konga/konga-app

# echo "[Unit]
# Description=Kong admin panel
# [Service]
# User=ubuntu
# WorkingDirectory=/home/ubuntu/konga
# ExecStart=/bin/bash /home/ubuntu/konga/konga-app
# SuccessExitStatus=143
# TimeoutStopSec=10
# Restart=on-failure
# RestartSec=300
# [Install]
# WantedBy=multi-user.target" | sudo tee -a /etc/systemd/system/konga-app.service

# sudo npm run bower-deps
# sudo npm install bower --allow-root

# sudo systemctl daemon-reload
# sudo systemctl enable konga-app.service
# sudo service konga-app start

# # Register JumpCloud System Groups
# SYSTEM_ID=$(curl "https://console.jumpcloud.com/api/systems?search[fields]=amazonInstanceID&search[searchTerm]=$INSTANCE_ID" --header 'Accept: application/json' --header 'Content-Type: application/json' --header 'x-api-key: '"${API_KEY}"'' | grep -oP '"id":"\K[^"\047]+(?=["\047])')
# curl -X POST https://console.jumpcloud.com/api/v2/systemgroups/$SYSTEM_GROUP/members --header 'Accept: application/json' --header 'Content-Type: application/json' --header 'x-api-key: '"${API_KEY}"'' -d '{"op": "add", "type": "system", "id":"'"${SYSTEM_ID}"'"}'
