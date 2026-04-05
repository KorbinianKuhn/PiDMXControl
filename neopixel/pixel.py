import array

import rp2
from machine import Pin


@rp2.asm_pio(sideset_init=rp2.PIO.OUT_LOW, out_shiftdir=rp2.PIO.SHIFT_LEFT, autopull=True, pull_thresh=32)
def sk6812():
    T1 = 2
    T2 = 5
    T3 = 3
    wrap_target()
    label("bitloop")
    out(x, 1)               .side(0)    [T3 - 1]
    jmp(not_x, "do_zero")   .side(1)    [T1 - 1]
    jmp("bitloop")          .side(1)    [T2 - 1]
    label("do_zero")
    nop()                   .side(0)    [T2 - 1]
    wrap()

class Neopixel:
    def __init__(self, num_leds, state_machine, pin, mode):
        self.pixels = array.array("I", [0] * num_leds)
        self.mode = mode
        self.sm = rp2.StateMachine(state_machine, sk6812, freq=8000000, sideset_base=Pin(pin))
        self.shift = ((mode.index('R') ^ 3) * 8, (mode.index('G') ^ 3) * 8, (mode.index('B') ^ 3) * 8, (mode.index('W') ^ 3) * 8)
        self.sm.active(1)
        self.num_leds = num_leds

    def set_pixel(self, pixel_num, rgbw):
        sh_R, sh_G, sh_B, sh_W = self.shift
        pix_value = rgbw[3] << sh_W | rgbw[2] << sh_B | rgbw[0] << sh_R | rgbw[1] << sh_G
        self.pixels[pixel_num] = pix_value

    def set_slice(self, start, end, rgbw):
        for i in range(start, end):
            self.set_pixel(i, rgbw)

    def fill(self,rgbw):
        for i in range(self.num_leds):
            self.set_pixel(i, rgbw)

    def clear(self):
        for i in range(self.num_leds):
            self.set_pixel(i, (0, 0, 0, 0))


    def show(self):        
        self.sm.put(self.pixels, 0)