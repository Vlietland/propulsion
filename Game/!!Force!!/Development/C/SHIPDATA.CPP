/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Ship&balldata       (shbldata.cpp)             */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze module worden alle gegevens van het schip en de           */
/*   ball bewaard.                                                     */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                   2 februari 1997                            */
/*=====================================================================*/

#include      "struct.h"
#include      "constant.h"


static Vectors positions;
static int     anglenr;
static int     thrust;
static int     fire;
static int     shields;
static int     rotate;

void initshipdata(void)
  {
   positions.ship.X = Xshipstartposition;
   positions.ship.Y = Yshipstartposition;
   positions.ball.X = Xballstartposition;
   positions.ball.Y = Yballstartposition;
  }

Vectors getpositions(void)
  { return(positions); }

void setpositions(Vectors newpositions)
  { positions = newpositions; }

bool getthrust(void)
  { return(thrust); }

void setthrust(bool newthrust)
  { thrust = newthrust; }


int getanglenr(void)
  { return(anglenr); }


void setanglenr(int newanglenr)
  { anglenr = newanglenr; }


int getrotate(void)
  { return(rotate); }


void setrotate(int newrotate)
  { rotate = newrotate; }

