/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Setup manager   (setup.cpp)	               */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze module staan alle functies die zorgen voor de             */
/*   initialisatie van het spel					       */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 12 maart 1997                                */
/*=====================================================================*/
#include	<iostream.h>
#include	<process.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"

#include        "!!forc~1\c\classen.h"

void Setupman::initgame()
  {
   start.level               =    1;
   start.score               =    0;
   start.ships               =    3;
   start.fuel	             = 5000;
   start.shipposition.X      =  200;
   start.shipposition.Y      =  200;

   com  .initshipcommands();
   user .inituserdata  (start.ships, start.score, start.level);
   ship .initshipball  (start.shipposition, start.fuel); // moet voor initmap
   enemy.initkogels    ();
   kogel.initkogels    ();
   map  .initmap       ();
  }

void Setupman::shipgoneinitgame()
  {

  }

void Setupman::nextlevelinitgame()
  {

  }

void Setupman::loadgame()
  {

  }

void Setupman::savegame()
  {

  }

void Setupman::restoregame()
  {
   com .restoreshipcommands();
  }