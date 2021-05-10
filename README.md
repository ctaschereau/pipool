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
`deno run --allow-net --allow-write --allow-read --allow-plugin --unstable index.ts`

## Todos
- Add script to create and manage service for Deno webserver
- Use a real way of templating stuff for the client-side (ex: Vue.js or React.js)
- Use w nice client-side lib
- Manage the fact that the _local.ts_ file could not be there
- Better logging (use nice datetime format) 
