/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Ship&balldata       (shbldata.h)               */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staan de declaraties van Ship&balldata               */
/*   Wanneer deze file geincluded wordt, krijgt met lees en schrijf    */
/*   rechten voor de Ship&balldatamanager                              */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#include       "struct.h"


extern void    initshipdata(void);
extern Vectors getpositions(void);
extern void    setpositions(Vectors newpositions);
extern bool    getthrust   (void);
extern void    setthrust   (bool newthrust);
extern int     getanglenr  (void);
extern void    setanglenr  (int newanglenr);
extern int     getrotate   (void);
extern void    setrotate   (int newrotate);


