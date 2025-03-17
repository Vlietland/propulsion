/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Zorgt voor de bouwsteenfiles (bouwmaak.cpp)    */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Dit programma zorgt voor het tekenen van de verschillende 	       */
/*   hoeken van het schip					       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 11 februari 1997                             */
/*=====================================================================*/
const  double   P2I  = 6.2831853;

#include	<stdio.h>
#include	<io.h>
#include	<FCNTL.H>
#include	<stdlib.h>
#include	<conio.h>
#include	<iostream.h>
#include	<dos.h>
#include	<math.h>

#include	"..\..\gamehead\gamehead.h"

void resetrotbuff();


bouwsteen    buff,rotbuff;
FILE	     *fpsource;
int          nummer = 0;

void main(int argc, char *argv[])
  {
   intvec	position;
   vector	rotposition;
   vector       offset = {(bloklengte-.5)/2,(blokhoogte-.5)/2};

   if       (argc != 3)
     cout << "\n usage: " << argv[0] << "\n source number of angles";

   else
    if ((fpsource = fopen(argv[1], "r+")) == NULL)
      cout << "\n cannot open file";

   else
     {
      double	deltaangle = P2I / atoi(argv[2]);
      setmode(fileno(fpsource), O_BINARY); // de stream wordt nu als binair behandeld
      cout << fread (buff.blok, sizeof(buff), 1, fpsource);
      fseek   (fpsource, 0, SEEK_CUR);

      for (double angle = deltaangle; angle < P2I; angle +=deltaangle)
	{
	 resetrotbuff();
	 for (position.Sy = 0; position.Sy < blokhoogte; position.Sy++)
	    for (position.Sx = 0; position.Sx < bloklengte; position.Sx++)
	      {
	       rotposition.X = (position.Sx - offset.X) * cos(angle) -
			       (position.Sy - offset.Y) * sin(angle) +
				offset.X;
	       rotposition.Y = (position.Sy - offset.Y) * cos(angle) +
			       (position.Sx - offset.X) * sin(angle) +
				offset.Y;
	       if ((rotposition.X >= 0) && (rotposition.X < bloklengte) &&
		   (rotposition.Y >= 0) && (rotposition.Y < blokhoogte))
		     rotbuff.blok[rotposition.Y][rotposition.X] = buff.blok[position.Sy][position.Sx];
	      }
	 cout << fwrite(rotbuff.blok, sizeof(buff), 1, fpsource);
	}
      fclose(fpsource);
     }
  }

void resetrotbuff()
  {
   intvec position;

   for (position.Sy = 0; position.Sy < blokhoogte; position.Sy++)
     for (position.Sx = 0; position.Sx < bloklengte; position.Sx++)
       rotbuff.blok[position.Sy][position.Sx] = 0;
  }