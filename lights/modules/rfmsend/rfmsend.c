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
#include <fcntl.h>
#include <sys/mman.h>

#define TIMER_BASE 0x20003000
#define INT_BASE 0x2000B000

volatile unsigned *timer,*intrupt;

int interrupts(int flag);
int setup(void);

int interrupts(int flag)
  {
  static unsigned int sav132 = 0;
  static unsigned int sav133 = 0;
  static unsigned int sav134 = 0;

  if(flag == 0)    // disable
    {
    if(sav132 != 0)
      {
      // Interrupts already disabled so avoid printf
      return(0);
      }

    if( (*(intrupt+128) | *(intrupt+129) | *(intrupt+130)) != 0)
      {
      printf("Pending interrupts\n");  // may be OK but probably
      return(0);                       // better to wait for the
      }                                // pending interrupts to
                                       // clear

    sav134 = *(intrupt+134);
    *(intrupt+137) = sav134;
    sav132 = *(intrupt+132);  // save current interrupts
    *(intrupt+135) = sav132;  // disable active interrupts
    sav133 = *(intrupt+133);
    *(intrupt+136) = sav133;
    }
  else            // flag = 1 enable
    {
    if(sav132 == 0)
      {
      printf("Interrupts not disabled\n");
      return(0);
      }

    *(intrupt+132) = sav132;    // restore saved interrupts
    *(intrupt+133) = sav133;
    *(intrupt+134) = sav134;
    sav132 = 0;                 // indicates interrupts enabled
    }
  return(1);
  }

int setup()
  {
  int memfd;
  void *timer_map,*int_map;

  memfd = open("/dev/mem",O_RDWR|O_SYNC);
  if(memfd < 0)
    {
    printf("Mem open error\n");
    return(0);
    }

  timer_map = mmap(NULL,4096,PROT_READ|PROT_WRITE,
                  MAP_SHARED,memfd,TIMER_BASE);

  int_map = mmap(NULL,4096,PROT_READ|PROT_WRITE,
                  MAP_SHARED,memfd,INT_BASE);

  close(memfd);

  if( timer_map == MAP_FAILED ||
     int_map == MAP_FAILED)
    {
    printf("Map failed\n");
    return(0);
    }
              // interrupt pointer
  intrupt = (volatile unsigned *)int_map;
              // timer pointer
  timer = (volatile unsigned *)timer_map;
  ++timer;    // timer lo 4 bytes
              // timer hi 4 bytes available via *(timer+1)

  return(1);
  }


static void
send_bits(uint16_t data, uint8_t bits)
{
  unsigned int timend1,timend0;
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
    timend1 = *timer + width;
    timend0 = timend1 + width;
    while( (((*timer)-timend1) & 0x80000000) != 0);
    digitalWrite (0, 0) ;
    while( (((*timer)-timend0) & 0x80000000) != 0);
    //printf ("Timeend1 %8u, Timeend0 %8u \n", timend1, timend0) ;
  }
}


static void
fs20_send_internal(uint16_t house, uint8_t addr, uint8_t cmd,
                   uint8_t data)
{
//i=3 is standard
  for (uint8_t i = 8; i; i--)
  {
    interrupts(0);
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
    interrupts(1);

    //delay(50);
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
  uint8_t quiet;
  quiet = 1;

  while ((opt = getopt(argc, argv, "a:s:q")) != -1) {
	switch (opt) {
		case 'a':
			adress = atoi(optarg);
			break;
		case 's':
			state = atoi(optarg);
			break;
		case 'q':
			quiet = 0;
			break;
		default: /* '?' */
			fprintf(stderr, "Usage: %s -a adress -s state [-q]\n",
				argv[0]);
			exit(EXIT_FAILURE);
	}
  }

  //printf ("Raspberry Pi sends rfm12 adress %8u, state %8u\n", adress, state) ;
  if (quiet) printf ("Raspberry Pi sends rfm12 adress %8u, state %8u \n", adress, state) ;
  setup();
  fs20_send_internal(0xCCCC, adress, state, 0x00);
  //fs20_send_internal(0xCCCC, adress, 0x10 , 0x00);
  return 0 ;
}

