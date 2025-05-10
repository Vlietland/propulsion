/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Draws ship and ball   (drawshbl.cpp)           */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze module tekent het schip en de ball                           */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#include        <graphics.h>
#include        <dos.h>
#include        <conio.h>

#include	"constant.h"
#include	"struct.h"
#include	"enum.h"
#include	"shipball.h"


extern Shipballdata shipballdata;

void drawshipandball(void)
  {
   static vector shipposition = {0,0};
   static vector ballposition = {0,0};

   line(5*shipposition.X-3,(400-5*shipposition.Y)-3,5*shipposition.X+3,(400-5*shipposition.Y)+3);
   line(5*shipposition.X,(400-5*shipposition.Y),5*ballposition.X,(400-5*ballposition.Y));

   shipposition = shipballdata.getshipposition();
   ballposition = shipballdata.getballposition();

   line(5*shipposition.X-3,(400-5*shipposition.Y)-3,5*shipposition.X+3,(400-5*shipposition.Y)+3);
   line(5*shipposition.X,(400-5*shipposition.Y),5*ballposition.X,(400-5*ballposition.Y));

   //delay(1000*cyclustime);
  }
