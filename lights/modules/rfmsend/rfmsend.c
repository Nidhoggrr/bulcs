/*
 * send.c:
 *      first rfm12 fs20
 *      Ronny Radke, ronny-spam@adke.org
 */

#define _BV(a) (1<<(a))
#define HI8(x)  ((uint8_t)((x) >> 8))
#define LO8(x)  ((uint8_t)(x))

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <unistd.h>
#include <getopt.h>
#include <wiringPi.h>

static void
send_bits(uint16_t data, uint8_t bits)
{
  if (bits == 8)
  {
    ++bits;
    data = (data << 1) | __builtin_parity(data);
  }

  for (uint16_t mask = (uint16_t) _BV(bits - 1); mask; mask >>= 1)
  {
    /* Timing values empirically obtained, and used to adjust for on/off
     * delay in the RFM12. The actual on-the-air bit timing we're after is
     * 600/600us for 1 and 400/400us for 0 - but to achieve that the RFM12B
     * needs to be turned on a bit longer and off a bit less. In addition
     * there is about 25 uS overhead in sending the on/off command over SPI.
     * With thanks to JGJ Veken for his help in getting these values right.
     */
    uint16_t width = data & mask ? 600 : 400;
    digitalWrite (0, 1) ;
    delayMicroseconds(width + 150) ;
    digitalWrite (0, 0) ;
    delayMicroseconds(width - 200) ;
  }
}

static void
fs20_send_internal(uint16_t house, uint8_t addr, uint8_t cmd,
                   uint8_t data)
{
  for (uint8_t i = 3; i; i--)
  {
    uint8_t sum = 0x06;

    send_bits(1, 13);
    send_bits(HI8(house), 8);
    sum += HI8(house);
    send_bits(LO8(house), 8);
    sum += LO8(house);
    send_bits(addr, 8);
    sum += addr;
    send_bits(cmd, 8);
    sum += cmd;
    if (cmd & 0x20)
    {
      send_bits(data, 8);
      sum += data;
    }
    send_bits(sum, 8);
    send_bits(0, 1);

    delay(10);
  }
}

int main ( int argc, char *argv[] )
{

  if (wiringPiSetup () == -1)
    return 1 ;

  pinMode (0, OUTPUT) ;         // aka BCM_GPIO pin 17

  int opt;
  uint8_t adress;
  uint8_t state;
  //adress=0;
  //state=0;
  //char *adress;
  //char *state;

  while ((opt = getopt(argc, argv, "a:s:")) != -1) {
	switch (opt) {
		case 'a':
			adress = atoi(optarg);
			break;
		case 's':
			state = atoi(optarg);
			break;
		default: /* '?' */
			fprintf(stderr, "Usage: %s -a adress -s state\n",
				argv[0]);
			exit(EXIT_FAILURE);
	}
  }

  //printf ("Raspberry Pi sends rfm12 adress %8u, state %8u\n", adress, state) ;
  printf ("Raspberry Pi sends rfm12 adress %8u, state %8u \n", adress, state) ;
  fs20_send_internal(0xCCCC, adress, state, 0x00);
  //fs20_send_internal(0xCCCC, 0x01, 0x10 , 0x00);
  return 0 ;
}

