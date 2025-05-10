/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Constanten definitie         (constant.h)      */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle constanten die nodig zijn voor          */
/*   het gehele programma                                              */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  12 maart 1997                               */
/*=====================================================================*/

#if !defined( _constant_h_)
#define _constant_h_

const float    P2I               =    6.2831854;

const  float   cyclustime        =    0.03;
const int      stanglength       =   38;   // meter
                                           // wordt gebruikt door mapdata en shipballdata
const  int     workingshipdamage =   32;
const  int     maxdamage         =  180;

const  int     kogelexplsoorten  =  8;
const  int     kogelsoorten      =  2*kogelexplsoorten +1;

#endif _constant_h_