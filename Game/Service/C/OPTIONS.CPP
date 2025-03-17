/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Start of game   (gameman.cpp)	               */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */


/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/
#include	<iostream.h>
#include	<process.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"

#include         "service\c\options.h"


void Optionsman::initsettings()
  {
   sounddevice = none;
   inputdevice = keyboard;
  }

void Optionsman::changesettings()
  {

  }