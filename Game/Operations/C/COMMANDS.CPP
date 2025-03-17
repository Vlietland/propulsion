/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Commando manager    (Commands.cpp)             */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staan diverse modules                                */
/*   * updatejoystickshipcommands				       */	
/*   * updatekeyboardshipcommands                                      */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/
#include	<dos.h>
#include	<iostream.h>
#include        <conio.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"

#include        "!!forc~1\c\classen.h"
#include	"operat~1\c\commands.cnt"
#include	"operat~1\c\commands.hft"

void Commandsman::initshipcommands()
  {
   jammed.shield = deactive;
   jammed.fire   = deactive;
   jammed.rotate = off;
   jammed.thrust = deactive;
   jammed.escape = deactive;
   shipcom = inter = jammed;

   oldhandler = _dos_getvect(keyboardint);
   _dos_setvect(keyboardint, keyboardinterrupt);
  }


void Commandsman::updateshipcommands()
  {
   shipcom = inter;  // inter defined in commands.hft

   if      (ship.getshipdamage() > workingshipdamage)
     shipcom = jammed;
   else if (!(ship.getfuelamount() > 0))
     {
      shipcom.thrust = deactive;
      shipcom.shield = deactive;
     }
  }


void Commandsman::restoreshipcommands()
  {
   _dos_setvect(keyboardint, oldhandler);
  }


