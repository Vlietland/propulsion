/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Test thrust routine (Main.cpp)                 */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze routine test of het mathematische model van het schip        */
/*   en de ball goed is ontworpen                                      */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#include       <conio.h>
#include       <graphics.h>
#include       <stdio.h>
#include       <stdlib.h>
#include       <dos.h>

#include       "constant.h"
#include       "shipdata.h"
#include       "shipcalc.h"

/* let op, dit is proef */
extern void drawshipandball(void);

static void initialisation(void);

void main(void)
  {
   char teken = 0;

	initialisation();

	while(teken != Return)
	  {
	   char bufferfull;

	   asm{
	       pusha
	       mov ax, 0x0B00
	       int 0x21
	       mov bufferfull,al
	       popa
	      }

	      if (bufferfull == -1)
		{
		 teken = getch();
		 if (teken == 'z') setrotate(left);
		 else if (teken == 'x') setrotate(right);
		 else if (teken == Spatie) setthrust(1);
		}
	      else
		{
		 setrotate(0);
		 setthrust(0);
		}

		calculate_shipanglenr();

		calculatepositions();

		drawshipandball();

		delay(30);


     }
  }


void initialisation(void)

  {
	int gdriver = DETECT, gmode, errorcode;

	if (registerbgidriver(EGAVGA_driver) < 0)
	  {
		printf("No graphicsdriver detected");
		exit(1);
	  }

   initgraph(&gdriver, &gmode, "");

   errorcode = graphresult();
   if (errorcode != grOk)
     {
      printf("Graphics error: %s\n", grapherrormsg(errorcode));
      exit(1);
     }

   directvideo = 1;
   setwritemode(1);
   initshipdata();
   }