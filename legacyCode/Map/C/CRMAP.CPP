/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Zorgt voor de bouwsteenfiles    (bouwins.cpp)  */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Dit programma zorgt voor het verwerken van de blokken gemaakt     */
/*   de resource workshop                                              */
/*   Het programma doet het volgende                                   */
/*   * weghalen van de extra info van het blokje                       */
/*   * bijvoegen van de informatie op de opgegeven plaats              */
/*   * de rest van de blokken opschuiven                               */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 11 februari 1997                             */
/*=====================================================================*/

#include	<stdio.h>
#include	<iostream.h>

#include	"..\..\gamehead\gamehead.h"
#include	"mapgeg.h"


void main(int argc, char *argv[])
  {
   FILE		*fpsource;
   mappiece     buff;

   buff.  soort   = empty;
   buff.  damage  = 0;
   buff.  status  = 0;
   buff.  Xextra  = 0;
   buff.  Yextra  = 0;

   if (argc != 2)
     cout << "usage: " << argv[0] << " source mapname";
   else if ((fpsource = fopen(argv[1], "w")) == NULL)
      cout << "cannot open file";
     else
     {
      for (int lengte = 0; lengte < maplengte; lengte++)
	for (int hoogte = 0; hoogte < maphoogte; hoogte++)
	  {
	   if (hoogte > rockdepth+1)
	     buff.soort = rockbegin;
	   else buff.soort = empty;
	   fwrite(&buff, sizeof(mappiece), 1, fpsource);
	  }
      fclose(fpsource);
     }
  }