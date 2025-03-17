/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de Shipdata 	(shpkogel.cpp)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staat de implementatie van de shipkogeldata          */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  12 april 1997                               */
/*=====================================================================*/
#include        <iostream.h>
#include        <conio.h>
#include        <io.h>
#include        <fcntl.h>
#include        <stdio.h>
#include        <process.h>
#include        <math.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\screen.h"
#include        "!!forc~1\c\enum.h"

#include        "operat~1\c\shpkogel.cnt"
#include        "!!forc~1\c\classen.h"
#include        "operat~1\c\shpkogel.hf2"
#include        "operat~1\c\shpkogel.hft"


void Shipkogels::initkogels()
  {
   FILE		*buildfile;
   char		*buildnaam = {"kogel.mix"};

   if ((buildfile = fopen(buildnaam, "r")) == NULL)
     { cout << "cannot open file"; exit(-1); }
   else if (fseek(buildfile, 0, SEEK_SET) == !0)
     { cout << "seek errors"; exit(-1); }
   else
     {
      setmode(fileno(buildfile),O_BINARY); // het zijn binaire files
      if (fread(kogelptr, sizeof(kogelbouwsteen), kogelsoorten, buildfile) != kogelsoorten)
        { cout << "end of file detected"; exit(-1); }
     }
   fclose(buildfile);

   listbegin();
   while (listOK())
     deletekogel();
   startptr = NULL;
   huidigptr = &startptr; // de inhoud van de huidigptr wordt geladen met het adres van startptr
  }


void Shipkogels::updatekogels()
  {
   static char counter; // om de snelheid te beperken

     if (com.getfirestatus() == active)
       if ((counter++ & fireslowdown) == 0)
         createkogel();

   listbegin();
   while (listOK())
     updatekogel();
  }


void Shipkogels::drawkogels()
  {
   listbegin();
   while (listOK())
     drawkogel();
  }


void Shipkogels::wipeoldkogels()
  {
   listbegin();
   while (listOK())
     wipekogel();
  }
