/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de userdata 	(userdata.cpp)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staat de implementatie van de userdata               */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/
#include        <conio.h>
#include        <iostream.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"

#include        "!!forc~1\c\classen.h"
#include        "operat~1\c\userdata.cnt"


void Userdata::inituserdata(int newscore, int newships, int newlevel)
  {
   score     = newscore;
   ships     = newships;
   level     = newlevel;
  }


gamestatus Userdata::updateuserdata()
  {
   if (ship.getshipdamage() > maxdamage)
     {
      ships--;
      reactorcheck();
      if (ships == 0)
	playstatus = gameover;
      else
	playstatus = shipgone;
     }
   else if (ship.gethyperspacestatus() == active)
     {
      level++;
      ships++;
      playstatus = nextlevel;
     }
   return(playstatus);
  }

void Userdata::drawuserdata()
  {
   gotoxy(5,1);
   cout << ship.getfuelamount();
   gotoxy(13,1);
   cout << ship.getshipdamage();
  }

void Userdata::reactorcheck()
  {

  }
