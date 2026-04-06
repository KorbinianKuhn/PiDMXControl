import _thread
import time
import network
from pixel import Neopixel
from umqttsimple import MQTTClient
import config

# --- Globals ---
neopixel = Neopixel(num_leds=150, state_machine=0, pin=21, mode="GRBW")
neopixel_state = bytearray(neopixel.num_leds * 4)
neopixel_state_updated_at = time.ticks_ms()
mqtt_state = bytearray(neopixel.num_leds * 4)
mqtt_state_updated_at = time.ticks_ms()
interrupt_time=0.005

# --- Neopixel ---
def update_neopixel(timeout_ms=5000):
    global neopixel_state, neopixel_state_updated_at, mqtt_state, mqtt_state_updated_at
    while True:
        now = time.ticks_ms()
        # No new data for x seconds
        if time.ticks_diff(now, mqtt_state_updated_at) > timeout_ms:
            neopixel.clear()
            neopixel.show()
        # New data and data changed
        elif mqtt_state_updated_at > neopixel_state_updated_at and mqtt_state != neopixel_state:
            neopixel_state[:] = mqtt_state[:]
            for i in range(neopixel.num_leds):
                idx = i * 4
                neopixel.set_pixel(i, tuple(neopixel_state[idx:idx+4]))
            neopixel.show()
            neopixel_state_updated_at = now

        time.sleep(interrupt_time) # allow interrupts

# --- MQTT ---
def on_mqtt_message(topic, msg):
    global mqtt_state, mqtt_state_updated_at
    if isinstance(msg, (bytes, bytearray)):
        mqtt_state[:] = msg[:min(len(msg), len(mqtt_state))]
        mqtt_state_updated_at = time.ticks_ms()

def connect_to_mqtt(server, device_id):
    client = MQTTClient(device_id, server)
    client.set_callback(on_mqtt_message)
    client.connect()
    client.subscribe(device_id)
    return client

def disconnect_mqtt_client(client):
    try:
        client.disconnect()
    except:
        pass

# --- Wifi ---
def connect_to_wifi(wifis, max_wait=30):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
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
                print("wifi: connection established", wifi_ssid)
                return wlan
            else:
                print("wifi: connection to", wifi_ssid, "failed")

    print("wifi: no known networks available")
    return None


# --- Connection loop ---
def ensure_connection(server, device_id, wifis, wifi_reconnect_interval=5, mqtt_reconnect_interval=1):
    wlan = None
    mqtt_client = None

    while True:
        # Ensure Wi-Fi is connected
        if wlan is None or not wlan.isconnected():
            # Invalidate mqtt client
            if mqtt_client is not None:
                print("mqtt: disconnect due to wifi loss")
                disconnect_mqtt_client(mqtt_client)
                mqtt_client = None

            # Connect to wifi
            wlan = connect_to_wifi(wifis)
            if wlan is None:
                print(f"wifi: retrying in {wifi_reconnect_interval}s")
                time.sleep(wifi_reconnect_interval)
                continue

        # Ensure MQTT is connected
        if mqtt_client is None:
            try:
                print("mqtt: connecting")
                mqtt_client = connect_to_mqtt(server, device_id)
                print("mqtt: connected")
            except Exception as e:
                print("mqtt: connection failed", e)
                mqtt_client = None
                print(f"wifi: retrying in {mqtt_reconnect_interval}s")
                time.sleep(mqtt_reconnect_interval)
                continue

        # Check for messages
        try:
            start = time.ticks_ms()
            ticks_stop = 1000
            
            while True:
                # Stop after interval
                now = time.ticks_ms()
                if time.ticks_diff(now, start) >= ticks_stop:
                    break

                # Detect Wi-Fi loss immediately
                if not wlan.isconnected():
                    print("wifi: lost during mqtt loop")
                    break

                # Process MQTT messages (burst)
                for _ in range(5):
                    mqtt_client.check_msg()

                time.sleep(interrupt_time) # allow interupts

        except Exception as e:
            print("mqtt: disconnect due to mqtt error", e)
            disconnect_mqtt_client(mqtt_client)
            mqtt_client = None

# --- Main ---
def main():
    initial_wait = 3
    for i in range(initial_wait):
        print(f"main: starting in {initial_wait-i}s...")
        time.sleep(1)

    # Update pixel loop
    try:
        _thread.start_new_thread(update_neopixel, ())
    except OSError as e:
        print("main: failed to start neopixel thread:", e)

    # Main loop (ensure wifi and mqtt connection)
    try:
        ensure_connection(config.host, config.device_id, config.wifis)
    except KeyboardInterrupt:
        print("main: stopped by user")

if __name__ == "__main__":
    main()