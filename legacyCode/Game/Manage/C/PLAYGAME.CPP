/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Start of game   (gameman.cpp)	               */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*                                                                     */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/
#include        <dos.h>
#include        <conio.h>
#include        <iostream.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"

#include         "!!forc~1\c\classen.h"

#include	"manage\c\playgame.hft"



gamestatus Playgameman::playgame(gamestatus newkeuze)
  {
   keuze = newkeuze;
   do{
      switch(keuze)
        {
         case init:        {preparegame();       startgame(); break;}
         case load:        {setup.loadgame();    startgame(); break;}
         case restart:     {preparegame();       startgame(); break;}
         case save:        {setup.savegame(); break;}
        }
      keuze = quit;
     }
   while ((keuze != quit) && (keuze != gameover));

   return(keuze);
  }

void Playgameman::preparegame()
  {
   if      (keuze == shipgone)
     setup.shipgoneinitgame();
   else if (keuze == nextlevel)
     setup.nextlevelinitgame();
   drawgame();
  }

void Playgameman::startgame()
  {
   gamestatus playstatus;
   do{
      manageshipball();
      managecore();
      playstatus = user.updateuserdata();
     }
   while ((playstatus == busy) && (com.getescapestatus() != active));

   keuze = playstatus;
  }

void Playgameman::manageshipball()
  {
   com.updateshipcommands();
   ship.updateshipballstatus();
   ship.updateshipballposition();
   kogel.updatekogels();
  }

void Playgameman::managecore()
  {
   map.updatemap();
   kogel.wipeoldkogels();
   enemy.wipeoldkogels();
   ship.wipeoldshipball();
   map.updatebackground();
   ship.drawshipball();
   user.drawuserdata();
   kogel.drawkogels();
   enemy.drawkogels();
   delay(13);
  }

//void Playgameman::manageenemy()
//  {
//   updateenemykogels();
//  }