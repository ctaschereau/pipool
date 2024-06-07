# pipool
Simple projet to display the temperature of a pool using one/two raspberry pi(es).

# Installing
1. have a one-wire thermometer sensor wired-up to your pi that is near the water
2. have a python web server running on that pi to be able to read the pool's temperature
2. have that pi powered up, connected to wifi, and with the sensor in the pool
3. using a different pi (or the same one), have a cron job that gets the pool's temperature at a given interval
4. have a nice webserver to display the results

## Putting it all together
- Step 1 : https://thepihut.com/blogs/raspberry-pi-tutorials/18095732-sensors-temperature-with-the-1-wire-interface-and-the-ds18b20
- Step 2 is accomplished by installing python3-flask and then running the script pi1_install.sh
- Step 3 is left up to the reader to figure out
- Steps 4 & 5 are done by running this :
`bun index.ts`
  or by setuping a service like this (for systemd) (in a file like /etc/systemd/system/pipool.service) : 
  ```
    [Unit]
    Description="PiPool"
  
    [Service]
    ExecStart=bun index.ts
    WorkingDirectory=/home/pi/pipool
    Restart=always
    RestartSec=10
    StandardOutput=syslog
    StandardError=syslog
    SyslogIdentifier=pipool
    User=pi

    [Install]
    WantedBy=multi-user.target```
  
## Notes

Let's say that the server's user is "pi" and the server is at 192:168.1.135, then to ssh into the server, you would do :
`ssh pi@192.168.1.135`
and to copy over all the server's csv files, you would do (only in bash for some weird reason, does not work in zsh...) :
`scp pi@192.168.1.135:/home/pi/pipool/*.csv .`

## Todos
- Add script to create and manage service
- Use a real way of templating stuff for the client-side (ex: Vue.js or React.js)
- Use a nice client-side lib
- Better logging (use nice datetime format) 
