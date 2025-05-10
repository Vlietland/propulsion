/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Classen include file         (classen.h)       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle constanten die nodig zijn voor          */
/*   het gehele programma                                              */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  12 maart 1997                               */
/*=====================================================================*/

#if !defined(_classen_h_)
#define _classen_h_

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


extern Playgameman  far play;
extern Setupman     far setup;
extern Optionsman   far option;
extern Mapdata      far map;
extern Enemykogel   far enemy;
extern Shipkogels   far kogel;
extern Userdata     far user;
extern Shipballdata far ship;
extern Commandsman  far com;
extern Movestuff    far move;

#endif _classen_h_