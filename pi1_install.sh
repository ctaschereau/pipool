echo "
[Unit]
Description=Get pypool service running at boot
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/pool_reader/pool.py
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=pypool
User=pi
" > /etc/systemd/system/pipypool.service

systemctl enable pipypool.service
systemctl start  pipypool.service
systemctl status pipypool.service
