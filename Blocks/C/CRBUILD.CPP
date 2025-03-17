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
#include	<stdlib.h>
#include	<iostream.h>

#include	"..\..\gamehead\gamehead.h"

void main(int argc, char *argv[])
  {
   intvec	punt;
   FILE		*fpsource, *fpdestination, *fpblok;
   int		insertposition;
   bouwsteen    buff;
   int		einde;

   if (argc != 3)
     cout << "usage: " << argv[0] << " source number";
   else if ((fpsource = fopen(argv[1], "w")) == NULL)
      cout << "cannot open file";
     else
     {
      einde = atoi(argv[2]);
      for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
	for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
	  buff.blok[punt.Sy][punt.Sx] = 0;
      for (int teller = 0; teller < einde; teller ++)
	fwrite(buff.blok, sizeof(bouwsteen), 1, fpsource);
      fclose(fpsource);
     }
  }