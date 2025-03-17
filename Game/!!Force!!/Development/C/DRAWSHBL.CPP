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

#include       <graphics.h>
#include       <conio.h>
#include       <stdio.h>

#include       "shipdata.h"


void drawshipandball(void)
  {
   static Vectors positions;

   line(5*positions.ship.X-3,(400-5*positions.ship.Y)-3,5*positions.ship.X+3,(400-5*positions.ship.Y)+3);
   line(5*positions.ship.X,(400-5*positions.ship.Y),5*positions.ball.X,(400-5*positions.ball.Y));

   positions = getpositions();

   line(5*positions.ship.X-3,(400-5*positions.ship.Y)-3,5*positions.ship.X+3,(400-5*positions.ship.Y)+3);
   line(5*positions.ship.X,(400-5*positions.ship.Y),5*positions.ball.X,(400-5*positions.ball.Y));
  }
