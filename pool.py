# Import Libraries
import os
import glob
import time
from flask import Flask
from flask import jsonify


# Initialize the GPIO Pins
os.system('modprobe w1-gpio')  # Turns on the GPIO module
os.system('modprobe w1-therm') # Turns on the Temperature module

# Finds the correct device file that holds the temperature data
base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

# A function that reads the sensors data
def read_temp_raw():
  f = open(device_file, 'r') # Opens the temperature device file
  lines = f.readlines() # Returns the text
  f.close()
  return lines

# Convert the value of the sensor into a temperature
def read_temp():
  # retry reading the temperature file a couple of times since it can fail for some unknown reason
  for i in range(5):
    lines = read_temp_raw() # Read the temperature 'device file'
    if lines:
      break

  # While the first line does not contain 'YES', wait for 0.2s
  # and then read the device file again.
  while lines[0].strip()[-3:] != 'YES':
    time.sleep(0.2)
    lines = read_temp_raw()

  # Look for the position of the '=' in the second line of the device file.
  equals_pos = lines[1].find('t=')

  # If the '=' is found, convert the rest of the line after the '=' into degrees Celsius
  if equals_pos != -1:
    temp_string = lines[1][equals_pos+2:]
    temp_c = float(temp_string) / 1000.0
    return temp_c


app = Flask(__name__)

@app.route("/")
def read_temp_route():
  return jsonify(temp=read_temp())

if __name__ == '__main__':
  app.run(host = '0.0.0.0')
