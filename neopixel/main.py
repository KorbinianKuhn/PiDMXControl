import _thread
import time
import network
from pixel import Neopixel
from umqttsimple import MQTTClient
import config

# --- Globals ---
pixels = Neopixel(num_leds=150, state_machine=0, pin=21, mode="GRBW")
data = bytearray(pixels.num_leds * 4)
last_data_received_at = time.time()
last_frame = bytearray(pixels.num_leds * 4) 
current_ssid = None

# --- Wi-Fi functions ---
def connect_to_wifi(wifis, max_wait=30):
    global current_ssid
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
        current_ssid = wlan.config('essid')
        return wlan

    print("wifi: scanning for available networks...")
    nets = wlan.scan()
    ssids = [net[0].decode() for net in nets]
    print("wifi: found networks", ssids)

    for wifi_ssid, wifi_password in wifis:
        if wifi_ssid in ssids:
            print("wifi: connecting to", wifi_ssid)
            wlan.connect(wifi_ssid, wifi_password)
            counter = 0
            while not wlan.isconnected() and counter < max_wait:
                print(f"wifi: waiting {max_wait - counter}s...")
                time.sleep(1)
                counter += 1

            if wlan.isconnected():
                current_ssid = wifi_ssid
                print("wifi: connection established", wlan.ifconfig())
                return wlan
            else:
                print("wifi: connection to", wifi_ssid, "failed")

    print("wifi: no known networks available")
    return None

def ensure_wifi_connected(wifis, check_interval=3):
    global current_ssid
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    while True:
        if not wlan.isconnected():
            print("wifi: disconnected, reconnecting...")
            wlan = connect_to_wifi(wifis)
            if wlan is None:
                print(f"wifi: retrying in {check_interval}s")
                time.sleep(check_interval)
                continue
        time.sleep(check_interval)

def connect_mqtt(server, device_id, callback):
    client = MQTTClient(device_id, server)
    client.set_callback(callback)
    client.connect()
    client.subscribe(device_id)
    print("MQTT: connected and subscribed")
    return client

def ensure_mqtt_connected(server, device_id, callback, check_interval=3):
    client = None
    wlan = network.WLAN(network.STA_IF)
    while True:
        if not wlan.isconnected():
            print("MQTT: waiting for Wi-Fi...")
            time.sleep(check_interval)
            continue

        if client is None:
            try:
                client = connect_mqtt(server, device_id, callback)
            except Exception as e:
                print("MQTT: connection failed:", e)
                time.sleep(check_interval)
                continue

        try:
            client.check_msg()
        except Exception as e:
            print("MQTT: disconnected, reconnecting...", e)
            try:
                client.disconnect()
            except:
                pass
            client = None
            time.sleep(check_interval)

        time.sleep(0.01)

# --- Pixel update loop ---
def update_pixels(timeout=5):
    global data, last_data_received_at

    while True:
        now = time.time()
        if now - last_data_received_at > timeout:
            pixels.clear()
            pixels.show()
        elif data != last_frame:
            for i in range(pixels.num_leds):
                idx = i * 4
                pixels.set_pixel(i, tuple(data[idx:idx+4]))
            pixels.show()
            last_frame[:] = data[:]

        time.sleep(0.001)

# --- MQTT message callback ---
def on_message(topic, msg):
    global data, last_data_received_at
    if isinstance(msg, (bytes, bytearray)):
        data[:] = msg[:min(len(msg), len(data))]
        last_data_received_at = time.time()

# --- Main ---
def main(server, device_id, wifis):
    # Start pixel update thread
    _thread.start_new_thread(update_pixels, ())

    # Start Wi-Fi reconnection thread
    _thread.start_new_thread(ensure_wifi_connected, (wifis,))

    # MQTT loop in main thread
    ensure_mqtt_connected(server, device_id, on_message)

if __name__ == "__main__":
    main(config.host, config.device_id, config.wifis)