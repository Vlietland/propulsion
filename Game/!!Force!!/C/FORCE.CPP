/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Start of game   (gameman.cpp)	               */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Dit is het hoofdprogramma van het spel hierin worden alle 	       */
/*   globale classen gedeclareerd.                                     */
/*   Alle klassen doen een deel van het programma en hebben onderling  */
/*   via de publieke functies met elkaar contact		       */
/*   Hierdoor wordt het gebruik van parameters, doorgegeven via	       */
/*   functies, tot een minimum beperkt				       */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/
#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"

#include	  "manage\c\playgame.h"
#include         "service\c\setup.h"
#include         "service\c\options.h"
#include        "operat~1\c\enemykgl.h"
#include        "operat~1\c\shpkogel.h"
#include        "operat~1\c\mapdata.h"
#include        "operat~1\c\userdata.h"
#include        "operat~1\c\shipball.h"
#include        "operat~1\c\commands.h"
#include        "operat~1\c\movestuf.h"



Playgameman  far play;
Setupman     far setup;
Optionsman   far option;
Enemykogel   far enemy;
Shipkogels   far kogel;
Mapdata      far map;
Userdata     far user;
Shipballdata far ship;
Commandsman  far com;
Movestuff    far move;


void initscreen();
void restorescreen();

void main()
  {
   initscreen();
   gamestatus keuze = init;

   do{
      switch(keuze)
        {
         case init:        {setup.initgame();
                            play.playgame(keuze);
                            setup.restoregame();
                            break;}
         case load:        {setup.initgame();
                            play.playgame(keuze);
                            setup.restoregame();
                            break;}
         case options:     {option.changesettings(); break;}
         case highscores:  {break;}
        }
      keuze = quit;
     }
   while (keuze != quit);

   restorescreen();
  }

void initscreen()
  {
   asm{
       mov	ah,0x00			//set videomode
       mov	al,0x13			//VGA
       int	   0x10			//call bios
      }
  }


void restorescreen()
  {
   asm{
       mov	ah,0x00			//set videomode
       mov	al,0x18			//VGA
       int	   0x10			//call bios
      }
  }
