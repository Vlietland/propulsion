/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Zorgt voor de bouwsteenfiles    (bouwins.cpp)  */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Zorgt voor de kleuren 0 - 255, samen met de header vormt dit een  */
/*   bitmap file                                                       */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 11 februari 1997                             */
/*=====================================================================*/

#include	<stdio.h>
#include	<stdlib.h>
#include	<iostream.h>


void main()
  {
   FILE		*fpdestination;
   
   if ((fpdestination = fopen("color.bin", "w")) == NULL)
      cout << "cannot open file";
   else
     {
      unsigned char teller = 0;
      while (teller < 255)
        fputc(teller++, fpdestination);

      fclose(fpdestination);
     }
  }